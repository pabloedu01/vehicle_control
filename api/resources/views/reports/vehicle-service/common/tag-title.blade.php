<table>
    <tbody>
    <tr>
        @isset($icon)
            <td class="tag-title h-30 {{ @$class ?? '' }}">
                {{ $title }}
                <span class="icon"><i class="{{ $icon }}"></i></span>
            </td>
        @else
            <td class="tag-title h-30 {{ @$class ?? '' }}">
                {{ $title }}
            </td>
        @endisset
    </tr>
    </tbody>
</table>
