const axios = require('axios');

exports.submitRating = async (req, res) => {
	try {
		const { rating, session_id } = req.body;

		console.log(`[Feedback] Received rating: ${rating}, session: ${session_id}`);

		const response = await axios.post('https://curizen.app.n8n.cloud/webhook/feedback', {
			query: rating.toString(),
			session_id
		});

		console.log('[Feedback] n8n response:', response.data);

		return res.status(200).json({
			status: 'success',
			message: 'Rating submitted successfully',
			data: response.data
		});
	} catch (error) {
		console.error('[Feedback] Error submitting rating:', error.message);
		return res.status(500).json({
			status: 'error',
			message: 'Failed to submit rating'
		});
	}
};
