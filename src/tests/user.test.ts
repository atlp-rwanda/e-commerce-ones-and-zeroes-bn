import express, { Express, Request, Response } from "express";

import UserController from "../controllers/userControllers"; // Import your controller
import { db } from "../database/models";

jest.mock("../database/models", () => ({
  db: {
    User: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    },
  },
}));

describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should register a new user", async () => {
      const req = await ({
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          password: "password123",
        },
      } as unknown as Request);
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(null);
      (db.User.create as jest.Mock).mockResolvedValueOnce({
        id: 1,
        ...req.body,
      });

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Account created!",
        savedUser: {
          id: 1,
          ...req.body,
        },
      });
    });

    // Add more test cases to cover edge cases and error scenarios
  });
  describe("getUsers", () =>{
    it("should return all users", async () =>{
      const users = [
        { id: 1, firstName: "John", lastName: "Doe" },
        { id: 2, firstName: "Jane", lastName: "Smith" },
      ]; 
  
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      (db.User.findAll as jest.Mock).mockResolvedValueOnce(users);

      await UserController.getUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    })
  })
  describe("getSingleUser", () => {
    it("should return single user profile using id", async () =>{
      const userId = 'bb9b8407-2d47-4e98-8b46-8a4b4f27fc2c'
      const req = {
        params: {
          id: userId
        },
      } as unknown as Request;
      const mockUser = {
        userId: "a41358ba-3cd3-424d-bb64-9540127675b3",
        firstName: "christian",
        lastName: "Ishimwe",
        email: "christianinja3@gmail.com",
        password: "qwertude",
        isActive: false,
        isGoogle: false,
    }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      (db.User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

      await UserController.getSingleUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "User Profile",
        data: mockUser
      })
    })
  })
  

  describe("updateSingle User", () =>{
    it("should update user information", async () =>{
      const userId="a41358ba-3cd3-424d-bb64-9540127675b3";
      const req = {
        params: {
          id: userId
        },
        body: {
          firstName: "John updated",
          lastName: "Doe",
          gender:"male",
          birthdate:"2000-07-27",
          preferredLanguage:"kinyarwanda",
          preferredCurrency:"RWF",
          billingAddress:"kigali"
        },
        
      } as unknown as Request;
  
      const userExist = {
        id: 1,
        firstName: "christian",
        lastName: "Ishimwe",
        statusCode: 200 
      } as any;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(userExist);
      jest.spyOn(db.User, 'save').mockResolvedValueOnce([1]); 
  
      await UserController.updateSingleUser(req, res);
      if (res.statusCode === 500) {
        console.error('Error:', (res.json as any).mock.calls[0][0]);

      }
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "Profile updated successfully",
       data: {
          id: 1,
          ...req.body,
        },
      });
    })
  })
  



  // Write similar tests for other UserController methods (getUsers, getSingleUser, updateSingleUser)
});
