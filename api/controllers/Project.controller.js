import Project from "../models/project.model.js";
import User from "../models/user.model.js"; 
import { errorHandler } from "../utils/index.js"; 
import mongoose from "mongoose";

export const addProject = async (req, res, next) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      teamMembers, 
      status,
      priority,
      tasks, 
    } = req.body;


    const project_managerId = req.user.id; 

    
    if (!name || !startDate || !status) {
      return next(
        errorHandler(400, "Name, Start Date, and Status are required.")
      );
    }

    if (!["admin", "project_manager"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "You can't access this api",user:req.user});
    }

    const Manager = await User.findById(req.user.id);
    if (!Manager) {
      return res
        .status(404)
        .json({ success: false, message: "Manager not found" });
    }

    
    const teamMembersArray = Array.isArray(teamMembers)
      ? teamMembers
      : typeof teamMembers === "string"
      ? teamMembers.split(",").map((id) => id.trim())
      : [];


    if (teamMembersArray.length < 1) {
      return res
        .status(404)
        .json({ success: false, message: "Atleat 1 team member required" });
    }

   
    if (teamMembersArray.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      return next(errorHandler(400, "Invalid Team Member ID(s)."));
    }

   
    const formattedTasks = tasks?.map((task) => {
      if (!task.name) {
        throw errorHandler(400, "Each task must have a name.");
      }
      return {
        name: task.name,
        dueDate: task.dueDate || null,
        status: task.status || "Pending",
      };
    }) || [];

   
      const newProject = new Project({
        name,
        description,
        startDate,
        endDate,
        Manager: project_managerId,
        teamMembers: teamMembersArray,
        status,
        priority,
        tasks: formattedTasks,
      });

    await newProject.save();

    return res.status(201).json({
      success: true,
      message: "Project added successfully.",
      project: newProject,
    });
  } catch (error) {
    console.error("Error adding project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
