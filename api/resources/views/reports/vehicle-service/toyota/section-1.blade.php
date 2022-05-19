<table id="section-1">
    <tbody>
    <tr>
        <td>
            @include('reports.vehicle-service.common.input', ['label' => 'Cliente', 'value' => 'Nombre Cliente'])
        </td>
    </tr>
    <tr>
        <td>
            <table>
                <tbody>
                <tr>
                    <td>
                        @include('reports.vehicle-service.common.input', ['label' => 'Placa', 'value' => '#Placa', 'class' => 'h-40'])
                    </td>
                    <td>
                        @include('reports.vehicle-service.common.tag-title', ['title' => 'Recepçáo', 'icon' => 'fa fa-car'])

                        @include('reports.vehicle-service.common.yes-no-option-column-header')
                    </td>

                    <td>
                        @include('reports.vehicle-service.common.tag-title', ['title' => 'Entrega', 'icon' => 'fa fa-car'])

                        @include('reports.vehicle-service.common.yes-no-option-column-header')
                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>

    <tr>
        <td>
            <table>
                <tbody>

                <tr>
                    <td>@include('reports.vehicle-service.common.tag-title', ['title' => 'C,lventc acompanha inspeçáo?'])</td>
                    <td>@include('reports.vehicle-service.common.yes-no-option-column', ['checked' => true])</td>
                    <td>@include('reports.vehicle-service.common.yes-no-option-column', ['checked' => false])</td>
                </tr>
                <tr>
                    <td>@include('reports.vehicle-service.common.tag-title', ['title' => 'Fixacáo tapete gentnno'])</td>
                    <td>@include('reports.vehicle-service.common.yes-no-option-column')</td>
                    <td>@include('reports.vehicle-service.common.yes-no-option-column')</td>
                </tr>
                <tr>
                    <td>@include('reports.vehicle-service.common.tag-title', ['title' => 'Macaco'])</td>
                    <td>@include('reports.vehicle-service.common.yes-no-option-column')</td>
                    <td>@include('reports.vehicle-service.common.yes-no-option-column')</td>
                </tr>
                <tr>
                    <td>@include('reports.vehicle-service.common.tag-title', ['title' => 'Triángulo'])</td>
                    <td>@include('reports.vehicle-service.common.yes-no-option-column')</td>
                    <td>@include('reports.vehicle-service.common.yes-no-option-column')</td>
                </tr>
                <tr>
                    <td>@include('reports.vehicle-service.common.tag-title', ['title' => 'Chave de roda'])</td>
                    <td>@include('reports.vehicle-service.common.yes-no-option-column')</td>
                    <td>@include('reports.vehicle-service.common.yes-no-option-column')</td>
                </tr>
                <tr>
                    <td>@include('reports.vehicle-service.common.tag-title', ['title' => 'Estepe'])</td>
                    <td>@include('reports.vehicle-service.common.yes-no-option-column')</td>
                    <td>@include('reports.vehicle-service.common.yes-no-option-column')</td>
                <tr>
                    <td>@include('reports.vehicle-service.common.tag-title', ['title' => 'Documento e Livrete de garantia'])</td>
                    <td>@include('reports.vehicle-service.common.yes-no-option-column')</td>
                    <td>@include('reports.vehicle-service.common.yes-no-option-column')</td>
                </tr>
                <tr>
                    <td>@include('reports.vehicle-service.common.tag-title', ['title' => 'Combustível'])</td>
                    <td>
                        @include('reports.vehicle-service.common.multiple-options-radius')
                    </td>
                    <td>@include('reports.vehicle-service.common.multiple-options-radius')</td>
                </tr>
                <tr>
                    <td>@include('reports.vehicle-service.common.tag-title', ['title' => 'Quilometragem'])</td>
                    <td><div class="bg-navy border-radius" style="color: unset;padding: 2px;">
                            @include('reports.vehicle-service.common.input', ['value' => 'kilometraje', 'class' => 'h-25'])
                        </div></td>
                    <td><div class="bg-navy border-radius" style="color: unset;padding: 2px;">
                            @include('reports.vehicle-service.common.input', ['value' => 'kilometraje', 'class' => 'h-25'])
                        </div></td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody>
</table>
