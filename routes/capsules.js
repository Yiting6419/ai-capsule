const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM capsules WHERE user_id = ?').all(req.user.userId);
  res.json(rows);
});

router.post('/', auth, (req, res) => {
  const { project_name, prompt_title, prompt_text } = req.body;
  const result = db.prepare(
    `INSERT INTO capsules (user_id, project_name, prompt_title, prompt_text) VALUES (?, ?, ?, ?)`
  ).run(req.user.userId, project_name, prompt_title, prompt_text);
  res.json({ id: result.lastInsertRowid });
});

router.put('/:id', auth, (req, res) => {
  const { project_name, prompt_title, prompt_text } = req.body;
  db.prepare(
    `UPDATE capsules SET project_name = ?, prompt_title = ?, prompt_text = ? WHERE id = ? AND user_id = ?`
  ).run(project_name, prompt_title, prompt_text, req.params.id, req.user.userId);
  res.json({ ok: true });
});

router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM capsules WHERE id = ? AND user_id = ?').run(req.params.id, req.user.userId);
  res.json({ ok: true });
});

module.exports = router;