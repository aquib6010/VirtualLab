/**
 * Experiment Model — Stores physics world state snapshots.
 */
const mongoose = require('mongoose');

const vec2Schema = new mongoose.Schema(
  { x: Number, y: Number },
  { _id: false }
);

const bodySchema = new mongoose.Schema(
  {
    id: String,
    type: {
      type: String,
      enum: ['rectangle', 'circle', 'trapezoid'],
    },
    label: String,
    position: vec2Schema,
    angle: Number,
    velocity: vec2Schema,
    angularVelocity: Number,
    isStatic: Boolean,
    mass: Number,
    friction: Number,
    restitution: Number,
    dimensions: {
      width: Number,
      height: Number,
      radius: Number,
      slope: Number,
    },
    render: {
      fillStyle: String,
      strokeStyle: String,
      lineWidth: Number,
    },
  },
  { _id: false }
);

const constraintSchema = new mongoose.Schema(
  {
    id: String,
    type: {
      type: String,
      enum: ['spring', 'rope', 'pivot', 'motor'],
    },
    bodyAId: String,
    bodyBId: String,
    pointA: vec2Schema,
    pointB: vec2Schema,
    stiffness: Number,
    length: Number,
    damping: Number,
    render: {
      strokeStyle: String,
      lineWidth: Number,
    },
  },
  { _id: false }
);

const experimentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Experiment title is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: '',
      maxlength: 500,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    worldState: {
      gravity: { type: vec2Schema, default: { x: 0, y: 1 } },
      bodies: [bodySchema],
      constraints: [constraintSchema],
    },
    thumbnail: String,
    tags: [String],
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast queries
experimentSchema.index({ owner: 1, updatedAt: -1 });
experimentSchema.index({ isPublic: 1, updatedAt: -1 });

module.exports = mongoose.model('Experiment', experimentSchema);
