<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Report Bro</title>

    <link rel="stylesheet" type="text/css" href="{{ url('assets/plugins/report-bro/dist/reportbro.css', [], str_contains(\Config::get('app.url'), 'https://')) }}"/>
    <script src="{{ url('assets/plugins/report-bro/dist/ext/jquery.js', [], str_contains(\Config::get('app.url'), 'https://')) }}"></script>
    <script src="{{ url('assets/plugins/report-bro/dist/reportbro.min.js', [], str_contains(\Config::get('app.url'), 'https://')) }}"></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300&display=swap" rel="stylesheet">

    <style>
        body,.rbroContainer, #reportbro{
            font-family: 'Nunito', sans-serif !important;
        }
    </style>
</head>
<body style="margin:0;">

<div id="reportbro"></div>

<script type="text/javascript">
    var checklistItems = JSON.parse('{!! json_encode($items->toArray()) !!}');
    var oldReport = JSON.parse('{!! json_encode($version->formatted_report) !!}');
</script>

<script type="text/javascript" src="{{ url('assets/js/report-bro/scripts.js', [], str_contains(\Config::get('app.url'), 'https://')) }}"></script>

</body>
</html>
