from fastapi import Request
from fastapi.responses import JSONResponse
from services.security_service import SecurityService

security_service = SecurityService()

async def verify_jwt_token(request: Request, call_next):
    # Skip auth check for these routes
    if request.method == "OPTIONS" or request.url.path in ["/login", "/register", "/refresh"]:
        return await call_next(request)

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse(status_code=401, content={"detail": "Missing or invalid Authorization header"})

    token = auth_header.split(" ")[1]

    try:
        security_service.verify_access_token(token)
    except Exception as e:
        # Instead of returning 401 here, pass the error to the response
        # Let frontend handle refresh token logic
        response = await call_next(request)
        response.status_code = 401
        response.body = b'{"detail": "Invalid or expired token"}'
        return response

    return await call_next(request)
