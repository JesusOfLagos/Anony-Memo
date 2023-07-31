const mongoose = require("mongoose");
const { expect } = require("chai");

const UserSchema = require("./path/to/UserSchema"); // Replace with the correct path to your UserSchema file

describe("UserSchema", () => {
  it("should be a valid schema", () => {
    const UserModel = mongoose.model("User", UserSchema);

    const user = new UserModel({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(user).to.be.an.instanceOf(mongoose.Model);
    expect(user.firstName).to.equal("John");
    expect(user.lastName).to.equal("Doe");
    expect(user.email).to.equal("john.doe@example.com");
    expect(user.userName).to.be.undefined;
    expect(user.messages).to.be.an("array").and.to.have.lengthOf(1);
    expect(user.password).to.equal("password123");
    expect(user.profilePicture).to.equal("");
    expect(user.isAdmin).to.be.false;
    expect(user.warnings).to.equal(0);
  });

});
