<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $jugadorId = $this->user()->jugador->id;

        return [
            'nickname' => [
                'required',
                'string',
                'alpha_dash',
                'max:255',
                \Illuminate\Validation\Rule::unique('jugadores', 'nickname')->ignore($jugadorId),
            ],
        ];
    }
}
