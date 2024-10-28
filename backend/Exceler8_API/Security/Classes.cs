

using System.Collections.Generic;

namespace Exceler8_API.Security
{
    public class AccessCredentials
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string RefreshToken { get; set; }
        public string GrantType { get; set; }
    }


    public static class Roles
    {
        public const string ROLE_API_PRODUTOS = "Acesso-E8API";
    }

    public class TokenConfigurations
    {
        public string Audience { get; set; }
        public string Issuer { get; set; }
        public int Seconds { get; set; }
        public int FinalExpiration { get; set; }
    }

    public class Token
    {
        public string Email { get; set; }
        public string UserName { get; set; }
        public bool Authenticated { get; set; }
        public string Created { get; set; }
        public string Expiration { get; set; }
        public string Access_token { get; set; }
        public string Token_type { get; set; }
        public string Refresh_token { get; set; }
        public string Message { get; set; }
        public List<string> Roles { get; set; }
    }

    public class RefreshTokenData
    {
        public string RefreshToken { get; set; }
        public string UserID { get; set; }
    }
}