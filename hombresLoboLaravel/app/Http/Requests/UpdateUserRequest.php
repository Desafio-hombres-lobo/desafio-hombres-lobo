<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;
use App\Models\User;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->tokenCan('admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $identifier = $this->route('user');
        $user = User::where('id', $identifier)
            ->orWhere('nickname', $identifier)
            ->first();

        $userId = $user ? $user->id : null;

        return [
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($userId)
            ],
            'nickname' => [
                'string',
                'alpha_dash',
                Rule::unique('users')->ignore($userId)
            ],
            'password' => ['sometimes', 'required', Rules\Password::defaults()],
        ];
    }
}
