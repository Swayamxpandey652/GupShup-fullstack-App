import pool from '../db/mysql.js';

export const sendMessage = async (req, res) => {
  const { receiver_id, message } = req.body;

  if (!receiver_id || !message) {
    return res.status(400).json({ message: 'Receiver and message are required' });
  }

  try {
    await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [req.user.id, receiver_id, message]
    );

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMessages = async (req, res) => {
  const { user_id } = req.params; // chatting with whom

  try {
    const [messages] = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`,
      [req.user.id, user_id, user_id, req.user.id]
    );

    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
