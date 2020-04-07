import { AzureFunction, Context } from "@azure/functions";
import * as csvParse from "csv-parse";
import * as fs from "fs";

const timerTriggerTransactions: AzureFunction = async (
  context: Context,
  // tslint:disable-next-line: no-any
  myTimer: any
): Promise<void> => {
  const timeStamp = new Date().toISOString();

  // It resolves a random problem at start time:
  // the timer trigger did not start sometimes due
  // to some indeterministic behaviour.
  // Wait untill the environment is fully loaded
  if (myTimer.IsPastDue) {
    // help at start time
    context.log("Environment not ready yet, wait ...");
  }

  const myParser: csvParse.Parser = csvParse(
    { delimiter: "," },
    (data, err) => {
      // qui abbiamo i dati dal file.
      console.log(data);
    }
  );

  const transactionsFiles = fs.readdirSync("./data");

  transactionsFiles.forEach(file => {
    context.log(file);
    fs.createReadStream(`./data/${file}`).pipe(myParser);
  });
  context.log("Timer verify function ran!", timeStamp);
};

export default timerTriggerTransactions;
