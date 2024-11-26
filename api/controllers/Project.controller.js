import Project from "../models/project.model.js";
import User from "../models/user.model.js"; 
import { errorHandler } from "../utils/index.js"; 

export const addProject = async (req, res, next) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      employee, 
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

    if (req.user.role !== "project_manager" || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const project_manager = await User.findById(req.user.id);
    if (!project_manager) {
      return res
        .status(404)
        .json({ success: false, message: "Manager not found" });
    }

    
    const teamMembersArray = employee
      ? employee.split(",").map((id) => id.trim())
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
        project_manager: project_managerId,
        employee: teamMembersArray,
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
