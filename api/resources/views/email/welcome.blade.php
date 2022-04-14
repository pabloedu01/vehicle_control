<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Email</title>
</head>
<body>
    Welcome to {{ env('APP_NAME') }}. <a href="{{ $code }}">Click here</a> to complete the register ({{ $code }})
</body>
</html>