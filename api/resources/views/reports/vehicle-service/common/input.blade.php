<div class="form-input h-30 {{ @$class ?? '' }}">
    @isset($label)
        <span class="label">{{ $label }}:</span>
    @endisset
    <span class="value">{{ $value }}</span>
</div>
