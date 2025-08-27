import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaintenanceService } from '../services/maintenance.service';
import * as XLSX from 'xlsx';

@Component({
  standalone: true,
  selector: 'app-department-master',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ReportsComponent implements OnInit {
  serviceForm!: FormGroup;
  loading = false;
  searchText = '';
  isEditMode = false;
  editingServiceId: string | null = null;

  // Data to be used for the reports
  policiesWithExceptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private _maintenanceService: MaintenanceService
  ) {}

  ngOnInit(): void {
    this.getPoliciesWithExceptionsAndAcknowledgements();
  }

  // Export to Excel
  exportToExcel() {
    try {
      const sheetName = 'Sheet'; // Replace with your dynamic sheet name

      // Ensure the sheet name is at most 31 characters
      const sanitizedSheetName = sheetName.length > 31 ? sheetName.substring(0, 31) : sheetName;

      // Your code to generate the Excel file (using the `xlsx` library or similar)
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.policiesWithExceptions);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sanitizedSheetName);

      // Generate the Excel file and trigger download
      XLSX.writeFile(wb, 'ExportedReport.xlsx');
    } catch (error) {
      console.error('Error exporting to Excel: ', error);
    }
  }

  // Export to CSV
  exportToCsv() {
    try {
      const data = this.policiesWithExceptions; // Assuming `policiesWithExceptions` is your data source

      // Convert JSON data to CSV string
      const csv = this.convertJsonToCsv(data);

      // Create a Blob from the CSV string
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

      // Create a link element
      const link = document.createElement('a');

      // Set the download attribute with a filename
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('download', 'Report.csv');

      // Append the link to the body, click to trigger download, and then remove the link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to CSV: ', error);
    }
  }

  private convertJsonToCsv(data: any[]): string {
    // Get the headers from the first item of the data
    const headers = Object.keys(data[0]);

    // Create the CSV string, starting with headers
    const csvRows = [
      headers.join(','), // Headers as the first row
      ...data.map(row => headers.map(fieldName => `"${row[fieldName]}"`).join(',')) // Data rows
    ];

    // Join the rows with newlines
    return csvRows.join('\n');
  }

  // Print the table
  printTable(): void {
    const printContents = document.getElementById('meetings_table')?.outerHTML;
    const printWindow = window.open('', '', 'height=600,width=900');
    if (printWindow && printContents) {
      printWindow.document.write('<html><head><title>Print Table</title>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(printContents);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  }

  // Fetch policies with exceptions and acknowledgements
  getPoliciesWithExceptionsAndAcknowledgements(): void {
    this.loading = true;
    this._maintenanceService.getPoliciesWithExceptionsAndAcknowledgements()
      .subscribe({
        next: (data) => {
          this.policiesWithExceptions = data;  // Store the result
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching policies:', error);
          this.loading = false;
        }
      });
  }
}
