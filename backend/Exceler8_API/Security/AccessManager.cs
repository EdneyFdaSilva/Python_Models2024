using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Exceler8_Domain.Services;
using Exceler8_Domain.Entities;
using Exceler8_Domain.Utils;
using System.Linq;

namespace Exceler8_API.Security
{
    public class AccessManager
    {
        private UserService _userService;
        private SigningConfigurations _signingConfigurations;
        private TokenConfigurations _tokenConfigurations;
        private IDistributedCache _cache;

        public AccessManager(
            SigningConfigurations signingConfigurations,
            TokenConfigurations tokenConfigurations,
            UserService userService,
            IDistributedCache cache)
        {
            _signingConfigurations = signingConfigurations;
            _tokenConfigurations = tokenConfigurations;
            _cache = cache;
            _userService = userService;
        }

        public bool ValidateCredentials(AccessCredentials credenciais, User userIdentity)
        {
            bool credenciaisValidas = false;
            if (credenciais != null && !String.IsNullOrWhiteSpace(credenciais.UserName))
            {
                if (credenciais.GrantType == "password" || credenciais.GrantType == null)
                {
                    // Verifica a existência do usuário
                    if (userIdentity != null)
                    {
                        credenciaisValidas = (Tools.ComputeSha256Hash(credenciais.Password) == userIdentity.Password);
                    }
                }
                else if (credenciais.GrantType == "refresh_token")
                {
                    if (!String.IsNullOrWhiteSpace(credenciais.RefreshToken))
                    {
                        RefreshTokenData refreshTokenBase = null;

                        string strTokenArmazenado =
                            _cache.GetString(credenciais.RefreshToken);
                        if (!String.IsNullOrWhiteSpace(strTokenArmazenado))
                        {
                            refreshTokenBase = JsonConvert
                                .DeserializeObject<RefreshTokenData>(strTokenArmazenado);
                        }

                        credenciaisValidas = (refreshTokenBase != null &&
                            credenciais.UserName == refreshTokenBase.UserID &&
                            credenciais.RefreshToken == refreshTokenBase.RefreshToken);

                        // Elimina o token de refresh já que um novo será gerado
                        if (credenciaisValidas)
                            _cache.Remove(credenciais.RefreshToken);
                    }
                }
            }

            return credenciaisValidas;
        }

        public string GetSessionInfo(string token)
        {
            var tokenParameter = new TokenValidationParameters()
            {
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ValidateAudience = true,
                ValidAudience = _tokenConfigurations.Audience,
                ValidateIssuer = true,
                ValidIssuer = _tokenConfigurations.Issuer,
                IssuerSigningKey = _signingConfigurations.Key,
                ClockSkew = TimeSpan.Zero
            };

            var handler = new JwtSecurityTokenHandler();

            handler.ValidateToken(token, tokenParameter, out var validatedToken);

            var jwtToken = handler.ReadJwtToken(token);
            var payload = jwtToken.Payload;


            string uniqueName = payload.ContainsKey("unique_name") ? payload["unique_name"].ToString() : null;
            
            return uniqueName;
        }

        public Token GenerateToken(AccessCredentials credenciais, User userIdentity)
        {
            ClaimsIdentity identity = new ClaimsIdentity(
                new GenericIdentity(credenciais.UserName, "Login"),
                new[] {
                        new Claim("Id", userIdentity.Id.ToString()),
                        new Claim("Name", userIdentity.UserRealName.ToString()),
                        new Claim("Username", userIdentity.Username.ToString()),
                        new Claim("Email", userIdentity.Email.ToString())
                }
            );

            identity.AddClaim(new Claim(ClaimTypes.Role, "User"));

            if (userIdentity.PermissionGroup.Where(xc => xc.Name.ToUpper().Contains("ADMIN") || xc.Name.ToUpper().Contains("SYSTEM")).Count() > 0)
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, "Admin"));
            }

            foreach (var role in userIdentity.PermissionGroup)
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, role.Name));
            }

            DateTime dataCriacao = DateTime.Now;
            DateTime dataExpiracao = dataCriacao + TimeSpan.FromSeconds(60 * 60 * 24);

            SecurityTokenDescriptor securityTokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _tokenConfigurations.Issuer,
                Audience = _tokenConfigurations.Audience,
                SigningCredentials = _signingConfigurations.SigningCredentials,
                Subject = identity,
                NotBefore = dataCriacao,
            };

            if (userIdentity.Username != "dashboardhp")
            {
                securityTokenDescriptor.Expires = dataExpiracao;
            }

            var handler = new JwtSecurityTokenHandler();
            var securityToken = handler.CreateToken(securityTokenDescriptor);
            var token = handler.WriteToken(securityToken);

            var resultado = new Token()
            {
                Email = userIdentity.Email,
                UserName = userIdentity.UserRealName,
                Authenticated = true,
                Created = dataCriacao.ToString("yyyy-MM-dd HH:mm:ss"),
                Expiration = dataExpiracao.ToString("yyyy-MM-dd HH:mm:ss"),
                Token_type = "Bearer",
                Access_token = token,
                Refresh_token = Guid.NewGuid().ToString().Replace("-", String.Empty),
                Message = "OK",
                Roles = userIdentity.PermissionGroup.Select(p => p.Name).ToList()
            };

            // Armazena o refresh token em cache através do Redis
            var refreshTokenData = new RefreshTokenData();
            refreshTokenData.RefreshToken = resultado.Refresh_token;
            refreshTokenData.UserID = credenciais.UserName;


            // Calcula o tempo máximo de validade do refresh token
            // (o mesmo será invalidado automaticamente pelo Redis)
            TimeSpan finalExpiration =
                TimeSpan.FromSeconds(60 * 60 * 24);

            DistributedCacheEntryOptions opcoesCache =
                new DistributedCacheEntryOptions();
            opcoesCache.SetAbsoluteExpiration(finalExpiration);
            _cache.SetString(resultado.Refresh_token,
                JsonConvert.SerializeObject(refreshTokenData),
                opcoesCache);

            return resultado;
        }

        //Decryption
        public string DecryptCredentials(string encrypted)
        {
            string cryptoPassword = "yoB?6w@yaBra4@$qI_4p";
            // base 64 decode
            byte[] encryptedBytesWithSalt = Convert.FromBase64String(encrypted);
            // extract salt (first 8 bytes of encrypted)
            byte[] salt = new byte[8];
            byte[] encryptedBytes = new byte[encryptedBytesWithSalt.Length - salt.Length - 8];
            Buffer.BlockCopy(encryptedBytesWithSalt, 8, salt, 0, salt.Length);
            Buffer.BlockCopy(encryptedBytesWithSalt, salt.Length + 8, encryptedBytes, 0, encryptedBytes.Length);
            // get key and iv
            byte[] key, iv;
            DeriveKeyAndIV(cryptoPassword, salt, out key, out iv);
            return DecryptStringFromBytesAes(encryptedBytes, key, iv);
        }

        private static void DeriveKeyAndIV(string passphrase, byte[] salt, out byte[] key, out byte[] iv)
        {
            // generate key and iv
            List<byte> concatenatedHashes = new List<byte>(48);
            byte[] password = Encoding.UTF8.GetBytes(passphrase);
            byte[] currentHash = new byte[0];
            MD5 md5 = MD5.Create();
            bool enoughBytesForKey = false;
            while (!enoughBytesForKey)
            {
                int preHashLength = currentHash.Length + password.Length + salt.Length;
                byte[] preHash = new byte[preHashLength];
                Buffer.BlockCopy(currentHash, 0, preHash, 0, currentHash.Length);
                Buffer.BlockCopy(password, 0, preHash, currentHash.Length, password.Length);
                Buffer.BlockCopy(salt, 0, preHash, currentHash.Length + password.Length, salt.Length);
                currentHash = md5.ComputeHash(preHash);
                concatenatedHashes.AddRange(currentHash);
                if (concatenatedHashes.Count >= 48)
                    enoughBytesForKey = true;
            }
            key = new byte[32];
            iv = new byte[16];
            concatenatedHashes.CopyTo(0, key, 0, 32);
            concatenatedHashes.CopyTo(32, iv, 0, 16);
            md5.Clear();
            md5 = null;
        }

        static string DecryptStringFromBytesAes(byte[] cipherText, byte[] key, byte[] iv)
        {
            // Check arguments.
            if (cipherText == null || cipherText.Length <= 0)
                throw new ArgumentNullException("cipherText");
            if (key == null || key.Length <= 0)
                throw new ArgumentNullException("key");
            if (iv == null || iv.Length <= 0)
                throw new ArgumentNullException("iv");
            // Declare the RijndaelManaged object
            // used to decrypt the data.
            RijndaelManaged aesAlg = null;
            // Declare the string used to hold
            // the decrypted text.
            string plaintext;
            try
            {
                // Create a RijndaelManaged object
                // with the specified key and IV.
                aesAlg = new RijndaelManaged { Mode = CipherMode.CBC, KeySize = 256, BlockSize = 128, Key = key, IV = iv };
                // Create a decrytor to perform the stream transform.
                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                // Create the streams used for decryption.
                using (MemoryStream msDecrypt = new MemoryStream(cipherText))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            plaintext = srDecrypt.ReadToEnd();
                            srDecrypt.Close();
                        }
                    }
                }
            }
            finally
            {
                // Clear the RijndaelManaged object.
                if (aesAlg != null)
                    aesAlg.Clear();
            }
            return plaintext;
        }


    }
}