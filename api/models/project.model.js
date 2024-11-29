import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  Manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    required: true,
    enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],
    default: 'Planning',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
  },
  tasks: [{
    name: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
  }],
});

const Project = mongoose.model('Project', projectSchema);

export default Project;