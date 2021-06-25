import { HttpClient } from '@angular/common/http'
import { Component, ElementRef } from '@angular/core'

@Component({
  selector: 'file-upload',
  templateUrl: "file-upload.component.html",
  styleUrls: ["file-upload.component.scss"]
})
export class FileUploadComponent {
  selectedFile: any

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]
  }

  constructor(private http: HttpClient, private el: ElementRef) { }

  onUpload() {
    const fd = new FormData()
    fd.append('data', this.selectedFile, this.selectedFile.name)
    this.http.put('http://localhost:5000/auth/profile/avatar', fd).subscribe(res => console.log(res)
    )
  }
}