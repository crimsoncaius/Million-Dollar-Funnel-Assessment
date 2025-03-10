import express from "express";
import cors from "cors";
import bodyParser from "body-parser"; // Middleware to parse request body as JSON
import { google } from "googleapis"; // Google API library
import questions from "./questions.json" assert { type: "json" };
import fs from "fs";
import { addHours } from "date-fns";

// Create a new instance of express
const app = express();
const port = 3000;

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ],
});

// Create client instance for auth
const client = await auth.getClient();

// Instance of Google Sheets API
const googleSheets = google.sheets({ version: "v4", auth: client });

//"1GJoT3zvzDzDXhaQFtli2YxTBW7w-9nMuJbgX9trlJJM" - Production Sheet
//"1DkD_p89ZpmADEVfEe7zhOtIog4KyNeIBASZxdxA2Pbk" - Test Sheet

const spreadsheetId = "1GJoT3zvzDzDXhaQFtli2YxTBW7w-9nMuJbgX9trlJJM";

// Enable CORS so that browser doesn't block requests.
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server Online");
});

// Middleware to parse JSON data in the request body
app.use(express.json());

// Define a route to handle POST requests with JSON data
app.post("/api/prospect", async (req, res) => {
  console.log("Triggered API");

  const jsonData = req.body.sendData; // JSON data sent in the request body

  const myDate = addHours(new Date(), 8);

  const answers = jsonData["answers"];

  const dataToAppend = [
    myDate.getFullYear() +
      "-" +
      (myDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      myDate.getDate().toString().padStart(2, "0") +
      " " +
      myDate.getHours().toString().padStart(2, "0") +
      ":" +
      myDate.getMinutes().toString().padStart(2, "0") +
      ":" +
      myDate.getSeconds().toString().padStart(2, "0"),
    jsonData["name"],
    jsonData["phoneNumber"],
    jsonData["email"],
    jsonData["company"],
    ...jsonData["answers"],
  ];

  // append rows
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!B:E",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [dataToAppend],
    },
  });

  fs.writeFileSync(
    `./reportstore/${jsonData["name"] + "-" + jsonData["phoneNumber"]}.txt`,
    `Name: ${jsonData["name"]}\nPhone Number: ${jsonData["phoneNumber"]}\nEmail: ${jsonData["email"]}\nCompany: ${jsonData["company"]}\n\n`,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );

  let percentage = 0;

  for (const answer of answers) {
    if (answer) {
      percentage += 5;
    }
  }

  let title, feedback;

  switch (true) {
    case percentage >= 80 && percentage <= 100:
      title = "You're Printing Money!";
      feedback =
        "This strategy's hotter than a fresh $100 bill. Stick with it, and you might just be the next big thing.";
      break;

    case percentage >= 60 && percentage < 80:
      title = "Smells Like Money!";
      feedback =
        "You've got a whiff of success. A few tweaks and you could be cashing in big time.";
      break;

    case percentage >= 40 && percentage < 60:
      title = "You're in the Mud, But There's Gold Somewhere.";
      feedback =
        "It's messy now, but with some digging, you could strike it rich.";
      break;

    case percentage >= 20 && percentage < 40:
      title = "This is a Dog.";
      feedback =
        "This ain't a million-dollar plan yet. Time for some major changes.";
      break;

    case percentage >= 0 && percentage < 20:
      title = "Take It Out Back and Shoot It.";
      feedback = "Start fresh. You've got homework.";
      break;

    default:
      title = "Invalid Percentage";
      feedback = "Please provide a valid percentage between 0 and 100.";
      break;
  }

  fs.appendFileSync(
    `./reportstore/${jsonData["name"] + "-" + jsonData["phoneNumber"]}.txt`,
    `Title: ${title}\nFeedback: ${feedback}\nScore: ${percentage}%\n\n`,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );

  fs.appendFileSync(
    `./reportstore/${jsonData["name"] + "-" + jsonData["phoneNumber"]}.txt`,
    `
Output & Feedback Based on Scores:
80% - 100%:
Title: "You're Printing Money!"
Feedback: "This strategy's hotter than a fresh $100 bill. Stick with it, and you might just be the next big thing."
60% - 79%:
Title: "Smells Like Money!"
Feedback: "You've got a whiff of success. A few tweaks and you could be cashing in big time."
40% - 59%:
Title: "You're in the Mud, But There's Gold Somewhere."
Feedback: "It's messy now, but with some digging, you could strike it rich."
20% - 39%:
Title: "This is a Dog."
Feedback: "This ain't a million-dollar plan yet. Time for some major changes."
0% - 19%:
Title: "Take It Out Back and Shoot It."
Feedback: "Start fresh. You've got homework."
  `,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );

  for (const [index, answer] of answers.entries()) {
    if (answer === false) {
      fs.appendFileSync(
        `./reportstore/${jsonData["name"] + "-" + jsonData["phoneNumber"]}.txt`,
        `\n\nType: ${questions.Questions[index].Type}\nQuestion: ${questions.Questions[index].Question}\nDiagnosis: ${questions.Questions[index].Diagnosis}\nSolution: ${questions.Questions[index].Solution}\n\n`,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  }

  const service = google.drive({ version: "v3", auth: client });

  //14Xw4hT9jC8ctjow9T-wghDjHuEt6SPH3 - Production Folder
  //1VUYPkIC8Sw5YVl7qinO5wcHtUSZDvK4P - Test Folder

  const metaData = {
    name: `${jsonData["name"] + "-" + jsonData["phoneNumber"]}.txt`,
    parents: ["14Xw4hT9jC8ctjow9T-wghDjHuEt6SPH3"],
  };

  const media = {
    mimeType: "text/plain",
    body: fs.createReadStream(
      `./reportstore/${jsonData["name"] + "-" + jsonData["phoneNumber"]}.txt`
    ),
  };

  try {
    const file = await service.files.create({
      resource: metaData,
      media: media,
      fields: "id",
    });
    res.status(200).json({ message: "JSON received successfully" });
    console.log("Success");
  } catch (err) {
    res.status(404).json({ message: "File not found" });
    console.log(err);
    throw err;
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
