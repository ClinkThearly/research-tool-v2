'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CataloguePage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
      setErrorMsg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) return;

    setIsLoading(true);
    setExtractedData(null);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', pdfFile);

    try {
      const backendUrl = 'https://pdf-slide-extractor-backend-dvandyke.replit.app/upload';
      const res = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setErrorMsg(errorData.error || 'Unable to process the file.');
        setIsLoading(false);
        return;
      }

      // Upload succeeded, now get the extraction_id
      const uploadData = await res.json();
      if (!uploadData.extraction_id) {
        setErrorMsg('Did not receive extraction_id from server.');
        setIsLoading(false);
        return;
      }

      // Use extraction_id to fetch the extracted data
      const dataUrl = `https://pdf-slide-extractor-backend-dvandyke.replit.app/data/${uploadData.extraction_id}`;
      const dataRes = await fetch(dataUrl);
      if (!dataRes.ok) {
        const errorData = await dataRes.json().catch(() => ({}));
        setErrorMsg(errorData.error || 'Failed to retrieve extracted data.');
        setIsLoading(false);
        return;
      }

      const fetchedData = await dataRes.json();
      if (Array.isArray(fetchedData.data)) {
        setExtractedData(fetchedData.data);
        setCurrentSlide(0);
      } else {
        setErrorMsg('Unexpected data format from server.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred while processing the PDF.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (extractedData && currentSlide < extractedData.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (extractedData && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slideCount = extractedData ? extractedData.length : 0;
  const currentSlideData = extractedData ? extractedData[currentSlide] : null;

  return (
    <Card className="p-4 md:p-6">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
          <span>Catalogue</span>
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
        </CardTitle>
        <CardDescription className="text-sm mt-1">
          Comprehensive research documentation and management.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-6">
        {!extractedData && (
          <div className="flex flex-col space-y-6">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-sm">
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">
                  Select a PDF to process:
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-border file:bg-background/50 file:text-foreground hover:file:bg-background focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={!pdfFile || isLoading}
                className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors 
                ${isLoading ? 'bg-gray-300 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'}
                disabled:bg-gray-300 disabled:text-gray-600`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Upload & Process'
                )}
              </button>
            </form>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
                {errorMsg}
              </div>
            )}
          </div>
        )}

        {extractedData && currentSlideData && (
          <>
            {/* Navigation Controls spanning full width */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setExtractedData(null)}
                className="text-sm text-blue-600 hover:underline"
              >
                ← Upload New PDF
              </button>
              <div className="text-sm text-foreground">
                Slide {currentSlide + 1} of {slideCount}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentSlide === 0}
                  className={`p-2 rounded border ${
                    currentSlide === 0
                      ? 'text-gray-400 border-gray-300'
                      : 'text-foreground border-border hover:bg-muted/20'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentSlide === slideCount - 1}
                  className={`p-2 rounded border ${
                    currentSlide === slideCount - 1
                      ? 'text-gray-400 border-gray-300'
                      : 'text-foreground border-border hover:bg-muted/20'
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Slide Preview */}
              <div className="flex flex-col space-y-4">
                <Card className="border border-border rounded-md overflow-hidden">
                  <CardHeader className="border-b p-3">
                    <CardTitle className="text-base">Slide Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {currentSlideData.image_base64 ? (
                      <img
                        alt={`Slide ${currentSlide + 1}`}
                        src={`data:image/png;base64,${currentSlideData.image_base64}`}
                        className="w-full h-auto"
                      />
                    ) : (
                      <div className="p-4 text-sm text-muted-foreground italic">
                        No slide image available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Extracted Data */}
              <div className="flex flex-col space-y-4">
                <Card className="border border-border rounded-md overflow-hidden h-full">
                  <CardHeader className="border-b p-3">
                    <CardTitle className="text-base">Extracted Data</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 flex flex-col gap-4">
                    {/* Slide Title */}
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">Slide Title</h3>
                      <p className="text-sm text-foreground">
                        {currentSlideData.slide_title || 'No title available'}
                      </p>
                    </div>

                    {/* Slide Text */}
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">Slide Text</h3>
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {currentSlideData.slide_text || 'No text available'}
                      </p>
                    </div>

                    {/* Charts */}
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">Charts</h3>
                      {currentSlideData.charts && currentSlideData.charts.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-foreground space-y-4">
                          {currentSlideData.charts.map((chart: any, idx: number) => {
                            const { chart_title, chart_type, chart_notes, chart_data } = chart;

                            return (
                              <li key={idx}>
                                <strong>{chart_title || 'Chart'}</strong><br/>
                                {chart_type && (
                                  <div className="mt-1 text-sm text-muted-foreground">
                                    <strong>Type:</strong> {chart_type}
                                  </div>
                                )}
                                {chart_notes && (
                                  <div className="mt-1 text-sm text-muted-foreground">
                                    <strong>Notes:</strong> {chart_notes}
                                  </div>
                                )}

                                {chart_data && typeof chart_data === 'object' && Object.keys(chart_data).length > 0 && (
                                  <div className="mt-2">
                                    <h4 className="text-sm font-semibold text-foreground mb-1">Chart Data</h4>
                                    {(() => {
                                      const firstValue = chart_data[Object.keys(chart_data)[0]];
                                      const isNested = typeof firstValue === 'object' && firstValue !== null;

                                      if (!isNested) {
                                        // Simple key-value pairs
                                        const keys = Object.keys(chart_data);
                                        return (
                                          <div className="overflow-auto">
                                            <table className="border border-border text-sm w-full">
                                              <thead>
                                                <tr>
                                                  {keys.map((key) => (
                                                    <th
                                                      key={key}
                                                      className="border border-border px-2 py-1 text-left bg-muted/20"
                                                    >
                                                      {key}
                                                    </th>
                                                  ))}
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr>
                                                  {Object.values(chart_data).map((value, i) => (
                                                    <td key={i} className="border border-border px-2 py-1">
                                                      {String(value)}
                                                    </td>
                                                  ))}
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        );
                                      } else {
                                        // Nested objects
                                        const columns = Object.keys(chart_data);
                                        // Gather all row labels from all nested objects
                                        const rowLabels = Array.from(
                                          new Set(columns.flatMap((col) => Object.keys(chart_data[col])))
                                        );

                                        return (
                                          <div className="overflow-auto">
                                            <table className="border border-border text-sm w-full">
                                              <thead>
                                                <tr>
                                                  <th className="border border-border px-2 py-1 bg-muted/20 text-left"></th>
                                                  {columns.map((col) => (
                                                    <th
                                                      key={col}
                                                      className="border border-border px-2 py-1 bg-muted/20 text-left"
                                                    >
                                                      {col}
                                                    </th>
                                                  ))}
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {rowLabels.map((rowLabel) => (
                                                  <tr key={rowLabel}>
                                                    <td className="border border-border px-2 py-1 font-semibold bg-muted/10">
                                                      {rowLabel}
                                                    </td>
                                                    {columns.map((col, cIdx) => {
                                                      const val = chart_data[col][rowLabel];
                                                      return (
                                                        <td key={cIdx} className="border border-border px-2 py-1">
                                                          {val === null || val === undefined ? '' : String(val)}
                                                        </td>
                                                      );
                                                    })}
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        );
                                      }
                                    })()}
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No charts available</p>
                      )}
                    </div>

                    {/* Tables */}
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">Tables</h3>
                      {currentSlideData.tables && currentSlideData.tables.length > 0 ? (
                        <div className="text-sm text-foreground">
                          {currentSlideData.tables.map((table: any, idx: number) => (
                            <div key={idx} className="mb-4">
                              <strong>{table.table_title || 'Table'}</strong>
                              {table.table_headers && (
                                <div className="overflow-auto mt-2">
                                  <table className="border border-border text-sm w-full">
                                    <thead>
                                      <tr>
                                        {table.table_headers.map((header: string, h_idx: number) => (
                                          <th key={h_idx} className="border border-border px-2 py-1 text-left bg-muted/20">
                                            {header}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {table.table_rows && table.table_rows.map((row: any[], r_idx: number) => (
                                        <tr key={r_idx}>
                                          {row.map((cell: string, c_idx: number) => (
                                            <td key={c_idx} className="border border-border px-2 py-1">
                                              {cell}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No tables available</p>
                      )}
                    </div>

                    {/* Images */}
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">Images</h3>
                      {currentSlideData.images && currentSlideData.images.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-foreground">
                          {currentSlideData.images.map((img: string, idx: number) => (
                            <li key={idx}>{img}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No images available</p>
                      )}
                    </div>

                    {/* Multimedia Content */}
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">Multimedia Content</h3>
                      {currentSlideData.media && currentSlideData.media.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-foreground">
                          {currentSlideData.media.map((m: any, idx: number) => (
                            <li key={idx}>
                              {m.media_type} - {m.media_description || 'No description'}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No multimedia content available</p>
                      )}
                    </div>

                    {/* Notes */}
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">Notes</h3>
                      <p className="text-sm text-foreground">
                        {currentSlideData.notes || 'No notes available'}
                      </p>
                    </div>

                    {/* Additional Elements */}
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">Additional Elements</h3>
                      <p className="text-sm text-foreground">
                        {currentSlideData.additional_elements || 'No additional elements'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {errorMsg && !extractedData && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3 mt-4">
            {errorMsg}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
