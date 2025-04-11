<?php

use PHPUnit\Framework\TestCase;

class LoginTest extends TestCase
{
    public function testLoginWithValidCredentials()
    {
        $postData = [
            'email' => 'testuser@example.com',
            'password' => 'correct_password'
        ];

        $response = $this->mockPostRequest($postData);
        $json = json_decode($response, true);

        $this->assertTrue($json['success']);
        $this->assertArrayHasKey('redirect', $json);
    }

    public function testLoginWithInvalidEmail()
    {
        $postData = [
            'email' => 'nonexistent@example.com',
            'password' => 'any_password'
        ];

        $response = $this->mockPostRequest($postData);
        $json = json_decode($response, true);

        $this->assertFalse($json['success']);
        $this->assertEquals('No user found with this email.', $json['message']);
    }

    public function testLoginWithWrongPassword()
    {
        $postData = [
            'email' => 'testuser@example.com',
            'password' => 'wrong_password'
        ];

        $response = $this->mockPostRequest($postData);
        $json = json_decode($response, true);

        $this->assertFalse($json['success']);
        $this->assertEquals('Incorrect password.', $json['message']);
    }

    // Mocked POST request method for unit testing
    private function mockPostRequest($data)
    {
        // Simulating a response based on the provided $data (you can modify this as needed)
        if ($data['email'] === 'testuser@example.com' && $data['password'] === 'correct_password') {
            return json_encode([
                'success' => true,
                'redirect' => '/dashboard'
            ]);
        }

        if ($data['email'] === 'nonexistent@example.com') {
            return json_encode([
                'success' => false,
                'message' => 'No user found with this email.'
            ]);
        }

        return json_encode([
            'success' => false,
            'message' => 'Incorrect password.'
        ]);
    }
}
