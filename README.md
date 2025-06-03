# RoastUme - CV Roasting Service 🔥

A fun and friendly CV review service that provides constructive feedback with a humorous twist. Get your resume reviewed by our witty AI critic who'll help you improve while keeping things light and entertaining.

## Author

**Created by**: [Your Name]  
**Contact**: [Your Email]  
**GitHub**: [Your GitHub Profile]

## Features

- 📄 Upload CV in PDF format
- 🤖 AI-powered review using DeepSeek
- 😄 Friendly and casual roasting style
- 📊 Structured feedback with scores
- 🎨 Modern, responsive UI with Tailwind CSS
- 🚀 Fast processing and real-time updates

## Tech Stack

### Backend
- **Python 3.9+** - Core backend logic
- **FastAPI** - Modern web framework
- **DeepSeek API** - AI review generation
- **PyPDF2** - PDF text extraction
- **Pydantic** - Data validation

### Frontend
- **TypeScript** - Type-safe JavaScript
- **React** - UI framework
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool and dev server

## Architecture

```
roastume/
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── core/           # Core business logic
│   │   ├── services/       # External services (DeepSeek)
│   │   ├── models/         # Data models
│   │   ├── api/            # API routes
│   │   └── utils/          # Utility functions
│   ├── config/             # Configuration
│   └── requirements.txt
├── frontend/               # TypeScript React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   ├── constants/      # App constants & strings
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.9 or higher
- Node.js 16 or higher
- DeepSeek API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd roastume
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your DeepSeek API key
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Run Development Servers**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn app.main:app --reload --port 8000
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Production Deployment

#### Docker Deployment
```bash
docker-compose up --build
```

#### Manual Deployment

**Backend (FastAPI)**:
- Deploy to services like Heroku, Railway, or AWS
- Set environment variables
- Use gunicorn for production WSGI server

**Frontend (React)**:
- Build: `npm run build`
- Deploy to Vercel, Netlify, or serve static files

#### Environment Variables
```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
CORS_ORIGINS=http://localhost:5173,https://yourdomain.com
MAX_FILE_SIZE=10485760  # 10MB
```

## Usage

1. **Upload CV**: Select and upload your PDF resume
2. **Processing**: Wait for AI analysis (usually 30-60 seconds)
3. **Review Results**: Get your roasted review with:
   - Overall score
   - Section-wise feedback
   - Improvement suggestions
   - Humorous but constructive comments

## API Endpoints

- `POST /api/upload` - Upload CV file
- `GET /api/review/{review_id}` - Get review status/results
- `GET /api/health` - Health check

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the API documentation at `/docs`
- Review the troubleshooting section below

## Troubleshooting

**Common Issues:**
- PDF parsing errors: Ensure PDF is text-selectable
- API timeouts: Check DeepSeek API status
- Upload failures: Verify file size under 10MB

**Performance Tips:**
- Use PDF files under 5MB for faster processing
- Ensure good internet connection for API calls
- Clear browser cache if UI issues persist

---

Made with ❤️ and a bit of sass 🔥