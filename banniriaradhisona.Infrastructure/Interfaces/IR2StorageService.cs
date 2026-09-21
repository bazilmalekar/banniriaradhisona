using System;
using System.Collections.Generic;
using System.Text;

namespace banniriaradhisona.Infrastructure.Interfaces
{
    public interface IR2StorageService
    {
        Task<string> UploadAsync(Stream fileStream, string objectKey, string contentType, CancellationToken cancellationToken = default);

        Task DeleteAsync(string objectKey, CancellationToken cancellationToken = default);
    }
}
