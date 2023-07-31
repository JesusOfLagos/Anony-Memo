


const request = require("supertest");
const express = require("express");
const { mockRequest, mockResponse } = require("jest-express-session");

// Import the functions to be tested
const {
  CreateUser,
  LoginUser,
  Logout,
  GetUser,
  EditUserName,
  EditProfilePicture,
} = require("./userController");

// Create a test app
const app = express();
app.use(express.json());

// Create a mock user data
const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  password: "testpassword",
};

describe("User Controller", () => {
  // ...

  // Test CreateUser function
  it("should fail to create a new user with missing required fields", async () => {
    const req = mockRequest({ body: { firstName: "John", lastName: "Doe" } });
    const res = mockResponse();

    await CreateUser(req, res);

    // Assertion: The user creation should fail due to missing required fields
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      errors: expect.any(Object),
    });
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // Test CreateUser function
  it("should fail to create a new user with invalid profile picture", async () => {
    const req = mockRequest({ body: mockUser, file: null });
    const res = mockResponse();

    await CreateUser(req, res);

    // Assertion: The user creation should fail due to missing profile picture
    expect(res.json).toHaveBeenCalledWith({
      message: "Please provide a valid image file",
      success: false,
    });
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // Test LoginUser function
  it("should fail to log in a user with incorrect password", async () => {
    const req = mockRequest({ body: { email: mockUser.email, password: "wrongpassword" } });
    const res = mockResponse();

    await LoginUser(req, res);

    // Assertion: The user should fail to log in due to incorrect password
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid Password",
      success: false,
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // Test Logout function
  it("should handle error while destroying the session on logout", async () => {
    const req = mockRequest();
    const res = mockResponse();

    // Mock session.destroy to throw an error
    req.session.destroy.mockImplementationOnce(callback => callback(new Error("Session Destroy Error")));

    await Logout(req, res);

    // Assertion: The user should log out successfully despite session destroy error
    expect(req.session.destroy).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith("Error destroying session:", expect.any(Error));
    expect(res.send).toHaveBeenCalledWith("User logged out successfully.");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // Test GetUser function
  it("should get a user by ID", async () => {
    const mockUserObject = {
      _id: "user123",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "hashedpassword",
      profilePicture: "profile_picture_url",
    };
    Users.findOne = jest.fn().mockResolvedValue(mockUserObject);

    const req = mockRequest({ params: { id: "user123" } });
    const res = mockResponse();

    await GetUser(req, res);

    // Assertion: The user should be found and returned
    expect(res.json).toHaveBeenCalledWith({
      user: expect.any(Object),
      success: true,
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

});





 // Test EditUserName function
 it("should edit a user's username", async () => {
    const req = mockRequest({ params: { _id: "user123" }, body: { newUserName: "newusername" } });
    const res = mockResponse();

    await EditUserName(req, res);

    // Assertion: The user's username should be updated successfully
    expect(res.json).toHaveBeenCalledWith({
      user: expect.any(Object),
      success: true,
      message: "Edited User Profile Successfully",
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // Test EditProfilePicture function
  it("should edit a user's profile picture", async () => {
    const req = mockRequest({ params: { userId: "user123" }, file: { path: "path_to_image" } });
    const res = mockResponse();

    await EditProfilePicture(req, res);

    // Assertion: The user's profile picture should be updated successfully
    expect(res.json).toHaveBeenCalledWith({ imageUrl: expect.any(String) });
    expect(res.status).toHaveBeenCalledWith(200);
  });