import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as JSZip from 'jszip';
import { HttpHeaderAuthorization } from '../utils/enums/http-header-authorization.enum';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  readonly baseUrl = environment.apiBaseUrl;
  private readonly http: HttpClient = inject(HttpClient);

  downloadZipFile(
    fileUrls: { name: string; url: string }[],
    zipName: string
  ): Observable<void> {
    var zip = new JSZip.default();
    const obsers: Observable<Blob>[] = [];

    fileUrls.forEach((fileUrl, index) => {
      const obser = this.http
        .get(fileUrl.url, {
          responseType: 'blob',
          headers: { Authorization: HttpHeaderAuthorization.NoAuth },
        })
        .pipe(
          map((blob) => {
            if (blob) {
              zip.file(`${fileUrl.name}`, blob);
            }

            return blob;
          }),
          catchError((error) => {
            return of('Error downloading images:', error);
          })
        );
      obsers.push(obser);
    });

    return forkJoin(obsers).pipe(
      take(1),
      map(() => {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          const url = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${zipName}.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      })
    );
  }

  urlToFile(url: string, filename: string): Observable<File | null> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map((blob) => {
        if (blob) {
          const file = new File([blob], filename, { type: blob.type });
          return file;
        }

        return null;
      }),
      catchError((error) => {
        return of('Error getting images:', error);
      })
    );
  }
}
