<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/toyota', function () {

    $pdf = \PDF::loadView('reports.vehicle-service.toyota.index');
    return $pdf->download('archivo-pdf.pdf');
});

Route::get('/toyota-view', function () {

    return view('reports.vehicle-service.toyota.index');
});

Route::get('/build-report', function(\Illuminate\Http\Request $request){
    $user = \Auth::guard('jwtWeb')->user();

    if($user && $user->privilege == 'admin')
    {
        $version = \App\Models\ChecklistVersion::withoutGlobalScope('simpleColumns')
                                               ->where('id', '=', $request->id)
                                               ->first();
        $version->append('formatted_report');

        $items = \App\Models\ChecklistItem::withTrashed()
                                          ->where('active', '=', true)
                                          ->whereNull('deleted_at');


        if(count($version->items) > 0)
        {
            $items = $items->orWhereIn('id', $version->items->pluck('id'));
        }

        $items = $items->get();

        if($version)
        {
            return view('reports.report-bro.build', compact([ 'items', 'version' ]));
        }
        else
        {
            abort('404');

            return false;
        }
    }
    else
    {
        abort('401');

        return false;
    }
})->middleware('jwt.verify');

Route::get('/save-report', function () {
    $url = 'https://www.reportbro.com/report/run?key=eade353d-4ac9-48f8-9e69-8c6a186ed8b6&outputFormat=pdf';

    $pdf = file_get_contents($url);

    \Storage::disk('public')->put('reports/test.pdf', $pdf);

    return \Storage::disk('public')->download('reports/test.pdf');
});

Route::get('/generate-report', function () {
    $layout = json_decode('{"docElements":[{"elementType":"text","id":123,"containerId":"0_content","x":250,"y":290,"width":100,"height":20,"content":"${combustivel}","richText":false,"richTextContent":null,"richTextHtml":"","eval":false,"styleId":"","bold":false,"italic":false,"underline":false,"strikethrough":false,"horizontalAlignment":"left","verticalAlignment":"top","textColor":"#000000","backgroundColor":"","font":"helvetica","fontSize":12,"lineSpacing":1,"borderColor":"#000000","borderWidth":1,"borderAll":false,"borderLeft":false,"borderTop":false,"borderRight":false,"borderBottom":false,"paddingLeft":2,"paddingTop":2,"paddingRight":2,"paddingBottom":2,"printIf":"","removeEmptyElement":false,"alwaysPrintOnSamePage":true,"pattern":"","link":"","cs_condition":"","cs_styleId":"","cs_bold":false,"cs_italic":false,"cs_underline":false,"cs_strikethrough":false,"cs_horizontalAlignment":"left","cs_verticalAlignment":"top","cs_textColor":"#000000","cs_backgroundColor":"","cs_font":"helvetica","cs_fontSize":12,"cs_lineSpacing":1,"cs_borderColor":"#000000","cs_borderWidth":"1","cs_borderAll":false,"cs_borderLeft":false,"cs_borderTop":false,"cs_borderRight":false,"cs_borderBottom":false,"cs_paddingLeft":2,"cs_paddingTop":2,"cs_paddingRight":2,"cs_paddingBottom":2,"spreadsheet_hide":false,"spreadsheet_column":"","spreadsheet_colspan":"","spreadsheet_addEmptyRow":false,"spreadsheet_textWrap":false}],"parameters":[{"id":1,"name":"page_count","type":"number","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":true,"testData":""},{"id":2,"name":"page_number","type":"number","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":true,"testData":""},{"id":101,"name":"clienteAcompanhaInspecao","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true},{"id":102,"name":"fixacaoTapeteGenuino","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true},{"id":103,"name":"macaco","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true},{"id":104,"name":"triangulo","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":false},{"id":105,"name":"chaveDeRoda","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true},{"id":106,"name":"estepe","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true},{"id":107,"name":"documentoELivreteDeGarantia","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true},{"id":108,"name":"combustivel","type":"number","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":40},{"id":109,"name":"quilometragemNumber","type":"number","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":200000},{"id":110,"name":"condicaoDeLimpeza","type":"string","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":"R"},{"id":111,"name":"veiculoOriundoDeGuincho","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true},{"id":112,"name":"pertencesPessoais","type":"string","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":"N"},{"id":113,"name":"temTapeteGenuinoToyota","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true},{"id":114,"name":"temKitMultimidia","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true},{"id":115,"name":"temFaroisDeNeblina","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true},{"id":116,"name":"temSoleira","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true},{"id":117,"name":"temSobrecapaDeParaChoque","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true},{"id":118,"name":"temBandejaDePortaMalas","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true},{"id":119,"name":"temEngate","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true},{"id":120,"name":"temApliqueCromado","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true},{"id":121,"name":"temCalhaDeChuva","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true},{"id":122,"name":"temRedeDePortaMalas","type":"boolean","arrayItemType":"string","eval":false,"nullable":false,"pattern":"","expression":"","showOnlyNameType":false,"testData":true}],"styles":[],"version":3,"documentProperties":{"pageFormat":"A4","pageWidth":"","pageHeight":"","unit":"mm","orientation":"portrait","contentHeight":"","marginLeft":"","marginTop":"","marginRight":"","marginBottom":"","header":true,"headerSize":"80","headerDisplay":"always","footer":true,"footerSize":"80","footerDisplay":"always","patternLocale":"en","patternCurrencySymbol":"$"}}', true);
    $dataFromParameters = collect($layout['parameters'])->keyBy('name')->except(['page_count', 'page_number'])->map(function($parameter){return $parameter['testData'];})->toArray();

    $items = \App\Models\ChecklistItem::where('active', '=', true)->get();
    $data = array_merge($dataFromParameters, $items->keyBy('formatted_name')->map(function($item){return $item->preview_data['value'];})->toArray());


    $curlInstance = callAPI('https://www.reportbro.com/report/run', 'PUT', json_encode([
                                                                                       'report'       => $layout,
                                                                                       'outputFormat' => 'pdf',
                                                                                       'data'         => $data,
                                                                                       'isTestData'   => true,
                                                                                   ]), false, ['Content-Type: application/json'], false, true);

    $response = curl_exec($curlInstance);
    $httpStatus = curl_getinfo($curlInstance, CURLINFO_HTTP_CODE);

    if($httpStatus == 200){
        if (is_string($response) && substr($response,0, 4) === 'key:') {
            $reportKey = substr($response,4);

            die('https://www.reportbro.com/report/run?key='.$reportKey.'&outputFormat=pdf');
        }
    } else {
        die('error');
    }
});
