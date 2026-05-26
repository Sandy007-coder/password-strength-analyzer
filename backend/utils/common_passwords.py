COMMON_PASSWORDS: set[str] = {
    "password", "123456", "12345678", "1234", "qwerty", "12345",
    "dragon", "pussy", "baseball", "iloveyou", "trustno1", "sunshine",
    "master", "welcome", "shadow", "ashley", "football", "jesus",
    "michael", "ninja", "mustang", "password1", "123456789",
    "abc123", "letmein", "monkey", "1234567", "696969", "superman",
    "slipknot", "batman", "tester", "hello", "charlie", "donald",
    "password123", "qwerty123", "1q2w3e4r", "111111", "1234567890",
    "123123", "000000", "zxcvbnm", "qazwsx", "666666", "123321",
    "654321", "987654321", "pass", "admin", "root", "login",
    "princess", "solo", "passw0rd", "starwars", "test", "access",
    "matrix", "burger", "jordan23", "harley", "ranger", "dakota",
    "maggie", "hunter", "tigger", "soccer", "hockey", "ranger",
    "george", "andrew", "michelle", "jessica", "pepper", "1111",
    "zxcvbn", "555555", "11111111", "131313", "freedom", "777777",
    "pass123", "qwerty1", "superman1", "pokemon", "baseball1",
    "whatever", "iloveme", "sunshine1", "fuckyou", "computer",
    "internet", "service", "canada", "hello123", "ranger1",
    "shadow1", "master1", "dragon1", "abc1234", "football1",
    "123abc", "password2", "love123", "q1w2e3r4", "pa$$word",
    "p@ssword", "p@$$w0rd", "passw0rd1", "1password", "2password",
    "apple", "orange", "banana", "summer", "winter", "spring",
    "flower", "monkey1", "cheese", "butter", "cookie", "heaven",
    "welcome1", "jesus1", "michael1", "batman1", "ninja1",
}


def is_common_password(password: str) -> bool:

    return password.lower() in COMMON_PASSWORDS
