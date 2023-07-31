

const mongoose = require("mongoose");
const { setupTestDB } = require("mongoose-mock");

const { MessageSchema } = require("./message"); // Assuming the schema is in a separate file

// Setup the test database
setupTestDB();

describe("MessageSchema", () => {
  it("should create a new message", async () => {
    // Create a new message using the schema
    const messageData = {
      title: "Test Message",
      note: "This is a test message",
      sentBy: mongoose.Types.ObjectId(),
      to: mongoose.Types.ObjectId(),
      isHidden: false,
      isDeleted: false,
    };
    const message = new MessageSchema(messageData);

    // Save the message to the database
    await message.save();

    // Find the message in the database
    const foundMessage = await MessageSchema.findOne({
      title: "Test Message",
    });

    // Assertion: The message should be found in the database
    expect(foundMessage).toBeTruthy();
    expect(foundMessage.title).toBe(messageData.title);
    expect(foundMessage.note).toBe(messageData.note);
    expect(foundMessage.sentBy.toString()).toBe(messageData.sentBy.toString());
    expect(foundMessage.to.toString()).toBe(messageData.to.toString());
    expect(foundMessage.isHidden).toBe(messageData.isHidden);
    expect(foundMessage.isDeleted).toBe(messageData.isDeleted);
  });

  it("should require title and note fields", async () => {
    // Attempt to create a message without title and note
    const message = new MessageSchema({
      sentBy: mongoose.Types.ObjectId(),
      to: mongoose.Types.ObjectId(),
      isHidden: false,
      isDeleted: false,
    });

    // Validation error should be thrown for missing required fields
    await expect(message.save()).rejects.toThrowError(
      mongoose.Error.ValidationError
    );
  });

  // Add more tests here for other scenarios you want to test
});
