import { AzureFunction, Context } from "@azure/functions";
import * as csvParse from "csv-parse/lib/sync";
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

  const transactionsFiles = fs.readdirSync("./data");

  transactionsFiles.forEach(file => {
    context.log(file);
    context.log("alllleeeeeeeoooo");
    const csvFile = fs.readFileSync(`./data/${file}`);
    const results = csvParse(csvFile, {
      cast: true,
      columns: true,
      delimiter: ","
    }) as readonly string[];

    context.log(results.slice(0, 10));
    // Print records to the console
  });
  context.log("Timer verify function ran!", timeStamp);
};

export default timerTriggerTransactions;
