import { appendFile } from "fs/promises";

interface WriteMessageToFileArrayOptions {
  filePath: string;
}

//
export default class WriteMessageToFileArray extends Array {
  private filePath: string;

  private processing: boolean;

  /**
   * Constructs an instance of WriteMessageToFileArray.
   *
   * @param {WriteMessageToFileArrayOptions | string} optionsOrPath
   * @returns {WriteMessageToFileArray}
   */
  constructor(optionsOrFilePath: WriteMessageToFileArrayOptions | string) {
    super();
    this.processing = false;

    let filePath: string;

    if (typeof optionsOrFilePath === "string") filePath = optionsOrFilePath;
    else filePath = optionsOrFilePath.filePath;

    this.filePath = filePath;
  }

  /**
   * Pushes the given message to the array and starts processing if not already processing.
   *
   * @param {string[]} messages[]
   * @returns {number}
   */
  public override push(...messages: string[]): number {
    const index = super.push(...messages);

    // Start processing if not already doing so
    if (this.processing === false) this.processMessages();

    return index;
  }

  /**
   * Processes the messages in the array by writing them to the file. Removing each message
   * after it is written.
   *
   * @returns {Promise<void>}
   */
  private async processMessages() {
    this.processing = true;

    while (this.length > 0) {
      const message = this[0];
      await appendFile(this.filePath, message + "\n");
      this.shift();
    }

    this.processing = false;
  }
}
