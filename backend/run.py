import os
from app import create_app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    print(f"==================================================")
    print(f" MedBooking - Clinic Appointment Booking System")
    print(f" Website Interface: http://localhost:{port}/")
    print(f" REST API Health:   http://localhost:{port}/api/health")
    print(f"==================================================")
    app.run(host='0.0.0.0', port=port, debug=debug)
