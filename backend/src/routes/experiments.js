/**
 * Experiment Routes — CRUD for physics experiments.
 */
const express = require('express');
const Experiment = require('../models/Experiment');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// ─── GET /api/experiments ─── List user's experiments ───────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const experiments = await Experiment.find({ owner: req.user._id })
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ experiments });
  } catch (error) {
    console.error('[Experiments] List error:', error);
    res.status(500).json({ message: 'Failed to fetch experiments.' });
  }
});

// ─── GET /api/experiments/public ─── Public experiments ─────────
router.get('/public', async (req, res) => {
  try {
    const experiments = await Experiment.find({ isPublic: true })
      .sort({ updatedAt: -1 })
      .limit(50)
      .populate('owner', 'displayName avatar')
      .lean();

    res.json({ experiments });
  } catch (error) {
    console.error('[Experiments] Public list error:', error);
    res.status(500).json({ message: 'Failed to fetch public experiments.' });
  }
});

// ─── GET /api/experiments/:id ─── Get single experiment ─────────
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id)
      .populate('owner', 'displayName avatar')
      .lean();

    if (!experiment) {
      return res.status(404).json({ message: 'Experiment not found.' });
    }

    // Check access
    if (!experiment.isPublic) {
      if (!req.user || experiment.owner._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied.' });
      }
    }

    res.json({ experiment });
  } catch (error) {
    console.error('[Experiments] Get error:', error);
    res.status(500).json({ message: 'Failed to fetch experiment.' });
  }
});

// ─── POST /api/experiments ─── Create experiment ────────────────
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, worldState, isPublic, tags } = req.body;

    const experiment = new Experiment({
      title: title || 'Untitled Experiment',
      description: description || '',
      owner: req.user._id,
      worldState: worldState || { gravity: { x: 0, y: 1 }, bodies: [], constraints: [] },
      isPublic: isPublic || false,
      tags: tags || [],
    });

    await experiment.save();

    // Add to user's experiments list
    req.user.experiments.push(experiment._id);
    await req.user.save();

    res.status(201).json({ experiment });
  } catch (error) {
    console.error('[Experiments] Create error:', error);
    res.status(500).json({ message: 'Failed to create experiment.' });
  }
});

// ─── PUT /api/experiments/:id ─── Update experiment ─────────────
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ message: 'Experiment not found.' });
    }

    if (experiment.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const { title, description, worldState, isPublic, tags } = req.body;

    if (title !== undefined) experiment.title = title;
    if (description !== undefined) experiment.description = description;
    if (worldState !== undefined) experiment.worldState = worldState;
    if (isPublic !== undefined) experiment.isPublic = isPublic;
    if (tags !== undefined) experiment.tags = tags;
    experiment.version += 1;

    await experiment.save();

    res.json({ experiment });
  } catch (error) {
    console.error('[Experiments] Update error:', error);
    res.status(500).json({ message: 'Failed to update experiment.' });
  }
});

// ─── DELETE /api/experiments/:id ─── Delete experiment ──────────
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ message: 'Experiment not found.' });
    }

    if (experiment.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    await Experiment.findByIdAndDelete(req.params.id);

    // Remove from user's experiments list
    req.user.experiments = req.user.experiments.filter(
      (id) => id.toString() !== req.params.id
    );
    await req.user.save();

    res.json({ message: 'Experiment deleted.' });
  } catch (error) {
    console.error('[Experiments] Delete error:', error);
    res.status(500).json({ message: 'Failed to delete experiment.' });
  }
});

module.exports = router;
