{
"version": 2,
"functions": {
"api/index.ts": {
"memory": 1024,
"maxDuration": 60
}
},
"routes": [
{
"src": "/(.\*)",
"dest": "/",
"methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}
]
}
