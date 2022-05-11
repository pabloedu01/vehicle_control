<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Email</title>
</head>
<body>
    Hi {{ $user['name'] }}, <a href="{{ $code }}">Click here</a> to recover your password ({{ $code }})
</body>
</html>
