<table class="table-cell-text-center">
    <tbody>
    <tr>
        <td class="w-50">
            <input type="checkbox" {{ @$checked === true ? 'checked' : '' }}/>
        </td>
        <td class="w-50">
            <input type="checkbox" {{ @$checked !== true ? 'checked' : '' }}/>
        </td>
    </tr>
    </tbody>
</table>
