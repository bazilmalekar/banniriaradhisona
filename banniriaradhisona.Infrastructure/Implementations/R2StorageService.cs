using Amazon.S3;
using Amazon.S3.Model;
using banniriaradhisona.Core.Settings;
using banniriaradhisona.Infrastructure.Interfaces;
using Microsoft.Extensions.Options;

namespace banniriaradhisona.Infrastructure.Implementations;

public class R2StorageService : IR2StorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly R2Settings _settings;

    public R2StorageService(IOptions<R2Settings> options)
    {
        _settings = options.Value;
        var credentials = new Amazon.Runtime.BasicAWSCredentials(_settings.AccessKeyId, _settings.SecretAccessKey);
        var config = new AmazonS3Config
        {
            ServiceURL = $"https://{_settings.AccountId}.r2.cloudflarestorage.com"
        };
        _s3Client = new AmazonS3Client(credentials, config);
    }

    public async Task<string> UploadAsync(
    Stream fileStream,
    string objectKey,
    string contentType,
    CancellationToken cancellationToken = default)
    {
        var request = new PutObjectRequest
        {
            BucketName = _settings.BucketName,
            Key = objectKey,
            InputStream = fileStream,
            ContentType = contentType,

            // Required for Cloudflare R2
            DisablePayloadSigning = true,
            DisableDefaultChecksumValidation = true
        };

        await _s3Client.PutObjectAsync(request, cancellationToken);

        return objectKey;
    }

    public async Task DeleteAsync(
    string objectKey,
    CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(objectKey))
        {
            return;
        }

        var request = new DeleteObjectRequest
        {
            BucketName = _settings.BucketName,
            Key = objectKey
        };

        await _s3Client.DeleteObjectAsync(request, cancellationToken);
    }
}