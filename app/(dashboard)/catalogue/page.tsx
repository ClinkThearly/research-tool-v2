'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '../../../components/ui/switch'; 
import { cn } from '@/lib/utils';

export default function CataloguePage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Track confirmation state for each field
  const [confirmedFields, setConfirmedFields] = useState<Record<string, boolean>>({});

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

      const uploadData = await res.json();
      if (!uploadData.extraction_id) {
        setErrorMsg('Did not receive extraction_id from server.');
        setIsLoading(false);
        return;
      }

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
        // Reset confirmed fields when new data is loaded
        setConfirmedFields({});
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
      setConfirmedFields({});
    }
  };

  const handlePrev = () => {
    if (extractedData && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setConfirmedFields({});
    }
  };

  const currentSlideData = extractedData ? extractedData[currentSlide] : null;

  const updateSlide = (partial: Partial<any>) => {
    if (!extractedData) return;
    const updated = [...extractedData];
    updated[currentSlide] = {
      ...updated[currentSlide],
      ...partial,
    };
    setExtractedData(updated);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSlide({ slide_title: e.target.value });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSlide({ slide_text: e.target.value });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSlide({ notes: e.target.value });
  };

  const handleAdditionalElementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSlide({ additional_elements: e.target.value });
  };

  const handleChartChange = (chartIndex: number, changes: Partial<any>) => {
    if (!extractedData) return;
    const updated = [...extractedData];
    const charts = updated[currentSlide].charts || [];
    charts[chartIndex] = { ...charts[chartIndex], ...changes };
    updated[currentSlide].charts = charts;
    setExtractedData(updated);
  };

  const handleChartDataKeyChange = (chartIndex: number, oldKey: string, newKey: string) => {
    if (!extractedData) return;
    const updated = [...extractedData];
    const chart = { ...updated[currentSlide].charts[chartIndex] };
    const oldData = chart.chart_data;
    const newData: Record<string, any> = {};

    for (const [k, v] of Object.entries(oldData)) {
      if (k === oldKey) {
        newData[newKey] = v;
      } else {
        newData[k] = v;
      }
    }
    chart.chart_data = newData;
    updated[currentSlide].charts[chartIndex] = chart;
    setExtractedData(updated);
  };

  const handleChartDataValueChange = (chartIndex: number, key: string, value: string) => {
    if (!extractedData) return;
    const updated = [...extractedData];
    const chart = { ...updated[currentSlide].charts[chartIndex] };
    chart.chart_data = { ...chart.chart_data, [key]: value };
    updated[currentSlide].charts[chartIndex] = chart;
    setExtractedData(updated);
  };

  const handleTableChange = (tableIndex: number, changes: Partial<any>) => {
    if (!extractedData) return;
    const updated = [...extractedData];
    const tables = updated[currentSlide].tables || [];
    tables[tableIndex] = { ...tables[tableIndex], ...changes };
    updated[currentSlide].tables = tables;
    setExtractedData(updated);
  };

  const handleTableHeaderChange = (tableIndex: number, headerIndex: number, newHeader: string) => {
    if (!extractedData) return;
    const updated = [...extractedData];
    const table = { ...updated[currentSlide].tables[tableIndex] };
    const newHeaders = [...table.table_headers];
    newHeaders[headerIndex] = newHeader;
    table.table_headers = newHeaders;
    updated[currentSlide].tables[tableIndex] = table;
    setExtractedData(updated);
  };

  const handleTableCellChange = (tableIndex: number, rowIndex: number, cellIndex: number, newValue: string) => {
    if (!extractedData) return;
    const updated = [...extractedData];
    const table = { ...updated[currentSlide].tables[tableIndex] };
    const newRows = table.table_rows.map((row: any[], rIdx: number) => {
      if (rIdx === rowIndex) {
        const newRow = [...row];
        newRow[cellIndex] = newValue;
        return newRow;
      }
      return row;
    });
    table.table_rows = newRows;
    updated[currentSlide].tables[tableIndex] = table;
    setExtractedData(updated);
  };

  const handleImageChange = (imageIndex: number, newValue: string) => {
    if (!extractedData) return;
    const updated = [...extractedData];
    const images = [...(updated[currentSlide].images || [])];
    images[imageIndex] = newValue;
    updated[currentSlide].images = images;
    setExtractedData(updated);
  };

  const handleMediaChange = (mediaIndex: number, field: 'media_type' | 'media_description', value: string) => {
    if (!extractedData) return;
    const updated = [...extractedData];
    const media = [...(updated[currentSlide].media || [])];
    media[mediaIndex] = { ...media[mediaIndex], [field]: value };
    updated[currentSlide].media = media;
    setExtractedData(updated);
  };

  // A helper function to generate a unique key for each field so we can track confirmation
  const fieldKey = (...parts: (string | number)[]) => parts.join('_');

  const toggleConfirm = (key: string) => {
    setConfirmedFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allFieldsConfirmed = () => {
    if (!currentSlideData) return false;

    const requiredKeys: string[] = [];

    // Add text fields
    requiredKeys.push(fieldKey('slide_title'));
    requiredKeys.push(fieldKey('slide_text'));

    // Charts
    if (currentSlideData.charts) {
      currentSlideData.charts.forEach((chart: any, cIdx: number) => {
        requiredKeys.push(fieldKey('chart', cIdx, 'chart_title'));
        requiredKeys.push(fieldKey('chart', cIdx, 'chart_type'));
        requiredKeys.push(fieldKey('chart', cIdx, 'chart_notes'));
        if (chart.chart_data) {
          Object.keys(chart.chart_data).forEach((keyName) => {
            requiredKeys.push(fieldKey('chart', cIdx, 'data', keyName));
          });
        }
      });
    }

    // Tables
    if (currentSlideData.tables) {
      currentSlideData.tables.forEach((table: any, tIdx: number) => {
        requiredKeys.push(fieldKey('table', tIdx, 'table_title'));
        table.table_headers?.forEach((_: string, hIdx: number) => {
          requiredKeys.push(fieldKey('table', tIdx, 'header', hIdx));
        });
        table.table_rows?.forEach((row: any[], rIdx: number) => {
          row.forEach((_: any, cIdx: number) => {
            requiredKeys.push(fieldKey('table', tIdx, 'cell', rIdx, cIdx));
          });
        });
      });
    }

    // Images
    if (currentSlideData.images) {
      currentSlideData.images.forEach((_: string, iIdx: number) => {
        requiredKeys.push(fieldKey('image', iIdx));
      });
    }

    // Media
    if (currentSlideData.media) {
      currentSlideData.media.forEach((m: any, mIdx: number) => {
        requiredKeys.push(fieldKey('media', mIdx, 'media_type'));
        requiredKeys.push(fieldKey('media', mIdx, 'media_description'));
      });
    }

    // Notes & Additional Elements
    requiredKeys.push(fieldKey('notes'));
    requiredKeys.push(fieldKey('additional_elements'));

    return requiredKeys.every((k) => confirmedFields[k]);
  };

  const confirmSlide = () => {
    if (allFieldsConfirmed()) {
      alert('Slide confirmed! All fields are verified.');
    } else {
      alert('Please confirm all fields before confirming this slide.');
    }
  };

  const slideCount = extractedData ? extractedData.length : 0;

  // A small helper to handle pressing Enter in inputs/textareas:
  const handleEnterConfirm = (fieldKeyStr: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Auto-confirm this field
      toggleConfirm(fieldKeyStr);
    }
  };

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
            {/* Navigation Controls */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  setExtractedData(null);
                  setConfirmedFields({});
                }}
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
                    <CardTitle className="text-base">Extracted Data (Editable & Confirmable)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 flex flex-col gap-4">
                    <Tabs defaultValue="text">
                      <TabsList>
                        <TabsTrigger value="text">Text</TabsTrigger>
                        <TabsTrigger value="charts">Charts</TabsTrigger>
                        <TabsTrigger value="tables">Tables</TabsTrigger>
                        <TabsTrigger value="other">Other</TabsTrigger>
                      </TabsList>

                      {/* Text Tab */}
                      <TabsContent value="text" className="mt-4 space-y-4">
                        <div>
                          <div className="flex items-center mb-1">
                            <h3 className="font-semibold text-sm text-foreground">Slide Title</h3>
                            <Switch 
                              checked={!!confirmedFields[fieldKey('slide_title')]}
                              onCheckedChange={() => toggleConfirm(fieldKey('slide_title'))}
                              className={cn('ml-auto', confirmedFields[fieldKey('slide_title')] ? 'opacity-100' : 'opacity-50')}
                            />
                          </div>
                          <Input
                            value={currentSlideData.slide_title || ''}
                            onChange={handleTitleChange}
                            placeholder="Enter slide title"
                            className="text-sm"
                            onKeyDown={(e) => handleEnterConfirm(fieldKey('slide_title'), e)}
                          />
                        </div>

                        <div>
                          <div className="flex items-center mb-1">
                            <h3 className="font-semibold text-sm text-foreground">Slide Text</h3>
                            <Switch
                              checked={!!confirmedFields[fieldKey('slide_text')]}
                              onCheckedChange={() => toggleConfirm(fieldKey('slide_text'))}
                              className={cn('ml-auto', confirmedFields[fieldKey('slide_text')] ? 'opacity-100' : 'opacity-50')}
                            />
                          </div>
                          <Textarea
                            value={currentSlideData.slide_text || ''}
                            onChange={handleTextChange}
                            placeholder="Enter slide text"
                            className="text-sm h-24"
                            onKeyDown={(e) => handleEnterConfirm(fieldKey('slide_text'), e)}
                          />
                        </div>
                      </TabsContent>

                      {/* Charts Tab */}
                      <TabsContent value="charts" className="mt-4 space-y-4">
                        <h3 className="font-semibold text-sm text-foreground">Charts</h3>
                        {currentSlideData.charts && currentSlideData.charts.length > 0 ? (
                          <ul className="list-none text-sm text-foreground space-y-4 pl-0">
                            {currentSlideData.charts.map((chart: any, cIdx: number) => {
                              const { chart_title, chart_type, chart_notes, chart_data } = chart;
                              const columns = chart_data ? Object.keys(chart_data) : [];

                              return (
                                <li key={cIdx} className="space-y-2 border-b pb-4">
                                  <div>
                                    <div className="flex items-center mb-1">
                                      <strong>Chart Title:</strong>
                                      <Switch
                                        checked={!!confirmedFields[fieldKey('chart', cIdx, 'chart_title')]}
                                        onCheckedChange={() => toggleConfirm(fieldKey('chart', cIdx, 'chart_title'))}
                                        className={cn('ml-auto', confirmedFields[fieldKey('chart', cIdx, 'chart_title')] ? 'opacity-100' : 'opacity-50')}
                                      />
                                    </div>
                                    <Input
                                      value={chart_title || ''}
                                      onChange={(e) => handleChartChange(cIdx, { chart_title: e.target.value })}
                                      placeholder="Chart title"
                                      className="text-sm"
                                      onKeyDown={(e) => handleEnterConfirm(fieldKey('chart', cIdx, 'chart_title'), e)}
                                    />
                                  </div>
                                  <div>
                                    <div className="flex items-center mb-1">
                                      <strong>Chart Type:</strong>
                                      <Switch
                                        checked={!!confirmedFields[fieldKey('chart', cIdx, 'chart_type')]}
                                        onCheckedChange={() => toggleConfirm(fieldKey('chart', cIdx, 'chart_type'))}
                                        className={cn('ml-auto', confirmedFields[fieldKey('chart', cIdx, 'chart_type')] ? 'opacity-100' : 'opacity-50')}
                                      />
                                    </div>
                                    <Input
                                      value={chart_type || ''}
                                      onChange={(e) => handleChartChange(cIdx, { chart_type: e.target.value })}
                                      placeholder="Chart type"
                                      className="text-sm"
                                      onKeyDown={(e) => handleEnterConfirm(fieldKey('chart', cIdx, 'chart_type'), e)}
                                    />
                                  </div>
                                  <div>
                                    <div className="flex items-center mb-1">
                                      <strong>Chart Notes:</strong>
                                      <Switch
                                        checked={!!confirmedFields[fieldKey('chart', cIdx, 'chart_notes')]}
                                        onCheckedChange={() => toggleConfirm(fieldKey('chart', cIdx, 'chart_notes'))}
                                        className={cn('ml-auto', confirmedFields[fieldKey('chart', cIdx, 'chart_notes')] ? 'opacity-100' : 'opacity-50')}
                                      />
                                    </div>
                                    <Textarea
                                      value={chart_notes || ''}
                                      onChange={(e) => handleChartChange(cIdx, { chart_notes: e.target.value })}
                                      placeholder="Chart notes"
                                      className="text-sm h-16"
                                      onKeyDown={(e) => handleEnterConfirm(fieldKey('chart', cIdx, 'chart_notes'), e)}
                                    />
                                  </div>
                                  {chart_data && (
                                    <div className="mt-2">
                                      <h4 className="text-sm font-semibold text-foreground mb-1">Chart Data</h4>
                                      {columns.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No data</p>
                                      ) : (
                                        <div className="overflow-auto">
                                          <table className="border border-border text-sm w-full">
                                            <thead>
                                              <tr>
                                                <th className="border border-border px-2 py-1 bg-muted/20">Key</th>
                                                <th className="border border-border px-2 py-1 bg-muted/20">Value</th>
                                                <th className="border border-border px-2 py-1 bg-muted/20">Confirm</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {columns.map((keyName) => (
                                                <tr key={keyName}>
                                                  <td className="border border-border px-2 py-1">
                                                    <Input
                                                      value={keyName}
                                                      onChange={(e) => handleChartDataKeyChange(cIdx, keyName, e.target.value)}
                                                      className="text-sm"
                                                      onKeyDown={(e) => handleEnterConfirm(fieldKey('chart', cIdx, 'data', keyName), e)}
                                                    />
                                                  </td>
                                                  <td className="border border-border px-2 py-1">
                                                    <Input
                                                      value={String(chart_data[keyName])}
                                                      onChange={(e) => handleChartDataValueChange(cIdx, keyName, e.target.value)}
                                                      className="text-sm"
                                                      onKeyDown={(e) => handleEnterConfirm(fieldKey('chart', cIdx, 'data', keyName), e)}
                                                    />
                                                  </td>
                                                  <td className="border border-border px-2 py-1 flex justify-center">
                                                    <Switch
                                                      checked={!!confirmedFields[fieldKey('chart', cIdx, 'data', keyName)]}
                                                      onCheckedChange={() => toggleConfirm(fieldKey('chart', cIdx, 'data', keyName))}
                                                      className={cn(confirmedFields[fieldKey('chart', cIdx, 'data', keyName)] ? 'opacity-100' : 'opacity-50')}
                                                    />
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">No charts available</p>
                        )}
                      </TabsContent>

                      {/* Tables Tab */}
                      <TabsContent value="tables" className="mt-4 space-y-4">
                        <h3 className="font-semibold text-sm text-foreground">Tables</h3>
                        {currentSlideData.tables && currentSlideData.tables.length > 0 ? (
                          <div className="text-sm text-foreground space-y-4">
                            {currentSlideData.tables.map((table: any, tIdx: number) => (
                              <div key={tIdx} className="border-b pb-4">
                                <div className="flex items-center mb-1">
                                  <strong>Table Title:</strong>
                                  <Switch
                                    checked={!!confirmedFields[fieldKey('table', tIdx, 'table_title')]}
                                    onCheckedChange={() => toggleConfirm(fieldKey('table', tIdx, 'table_title'))}
                                    className={cn('ml-auto', confirmedFields[fieldKey('table', tIdx, 'table_title')] ? 'opacity-100' : 'opacity-50')}
                                  />
                                </div>
                                <Input
                                  value={table.table_title || ''}
                                  onChange={(e) => handleTableChange(tIdx, { table_title: e.target.value })}
                                  placeholder="Table title"
                                  className="text-sm mb-2"
                                  onKeyDown={(e) => handleEnterConfirm(fieldKey('table', tIdx, 'table_title'), e)}
                                />

                                {table.table_headers && (
                                  <div className="overflow-auto mt-2">
                                    <table className="border border-border text-sm w-full">
                                      <thead>
                                        <tr>
                                          {table.table_headers.map((header: string, h_idx: number) => (
                                            <th key={h_idx} className="border border-border px-2 py-1 bg-muted/20">
                                              <div className="flex flex-col gap-1">
                                                <Input
                                                  value={header}
                                                  onChange={(e) => handleTableHeaderChange(tIdx, h_idx, e.target.value)}
                                                  className="text-sm"
                                                  onKeyDown={(e) => handleEnterConfirm(fieldKey('table', tIdx, 'header', h_idx), e)}
                                                />
                                                <Switch
                                                  checked={!!confirmedFields[fieldKey('table', tIdx, 'header', h_idx)]}
                                                  onCheckedChange={() => toggleConfirm(fieldKey('table', tIdx, 'header', h_idx))}
                                                  className={cn(confirmedFields[fieldKey('table', tIdx, 'header', h_idx)] ? 'opacity-100' : 'opacity-50')}
                                                />
                                              </div>
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {table.table_rows && table.table_rows.map((row: any[], r_idx: number) => (
                                          <tr key={r_idx}>
                                            {row.map((cell: string, c_idx: number) => (
                                              <td key={c_idx} className="border border-border px-2 py-1">
                                                <div className="flex flex-col gap-1">
                                                  <Input
                                                    value={cell}
                                                    onChange={(e) => handleTableCellChange(tIdx, r_idx, c_idx, e.target.value)}
                                                    className="text-sm"
                                                    onKeyDown={(e) => handleEnterConfirm(fieldKey('table', tIdx, 'cell', r_idx, c_idx), e)}
                                                  />
                                                  <Switch
                                                    checked={!!confirmedFields[fieldKey('table', tIdx, 'cell', r_idx, c_idx)]}
                                                    onCheckedChange={() => toggleConfirm(fieldKey('table', tIdx, 'cell', r_idx, c_idx))}
                                                    className={cn(confirmedFields[fieldKey('table', tIdx, 'cell', r_idx, c_idx)] ? 'opacity-100' : 'opacity-50')}
                                                  />
                                                </div>
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
                      </TabsContent>

                      {/* Other Tab */}
                      <TabsContent value="other" className="mt-4 space-y-4">
                        {/* Images */}
                        <div>
                          <h3 className="font-semibold text-sm text-foreground">Images</h3>
                          {currentSlideData.images && currentSlideData.images.length > 0 ? (
                            <ul className="list-none text-sm text-foreground space-y-2 pl-0">
                              {currentSlideData.images.map((img: string, iIdx: number) => (
                                <li key={iIdx}>
                                  <div className="flex items-center mb-1">
                                    <span>Image {iIdx + 1}</span>
                                    <Switch
                                      checked={!!confirmedFields[fieldKey('image', iIdx)]}
                                      onCheckedChange={() => toggleConfirm(fieldKey('image', iIdx))}
                                      className={cn('ml-auto', confirmedFields[fieldKey('image', iIdx)] ? 'opacity-100' : 'opacity-50')}
                                    />
                                  </div>
                                  <Input
                                    value={img}
                                    onChange={(e) => handleImageChange(iIdx, e.target.value)}
                                    className="text-sm w-full"
                                    onKeyDown={(e) => handleEnterConfirm(fieldKey('image', iIdx), e)}
                                  />
                                </li>
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
                            <ul className="list-none text-sm text-foreground space-y-4 pl-0">
                              {currentSlideData.media.map((m: any, mIdx: number) => (
                                <li key={mIdx} className="space-y-1 border-b pb-4">
                                  <div className="flex items-center mb-1">
                                    <strong>Media Type:</strong>
                                    <Switch
                                      checked={!!confirmedFields[fieldKey('media', mIdx, 'media_type')]}
                                      onCheckedChange={() => toggleConfirm(fieldKey('media', mIdx, 'media_type'))}
                                      className={cn('ml-auto', confirmedFields[fieldKey('media', mIdx, 'media_type')] ? 'opacity-100' : 'opacity-50')}
                                    />
                                  </div>
                                  <Input
                                    value={m.media_type || ''}
                                    onChange={(e) => handleMediaChange(mIdx, 'media_type', e.target.value)}
                                    className="text-sm"
                                    onKeyDown={(e) => handleEnterConfirm(fieldKey('media', mIdx, 'media_type'), e)}
                                  />
                                  <div className="flex items-center mb-1 mt-2">
                                    <strong>Media Description:</strong>
                                    <Switch
                                      checked={!!confirmedFields[fieldKey('media', mIdx, 'media_description')]}
                                      onCheckedChange={() => toggleConfirm(fieldKey('media', mIdx, 'media_description'))}
                                      className={cn('ml-auto', confirmedFields[fieldKey('media', mIdx, 'media_description')] ? 'opacity-100' : 'opacity-50')}
                                    />
                                  </div>
                                  <Textarea
                                    value={m.media_description || ''}
                                    onChange={(e) => handleMediaChange(mIdx, 'media_description', e.target.value)}
                                    className="text-sm h-16"
                                    onKeyDown={(e) => handleEnterConfirm(fieldKey('media', mIdx, 'media_description'), e)}
                                  />
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">No multimedia content available</p>
                          )}
                        </div>

                        {/* Notes */}
                        <div>
                          <div className="flex items-center mb-1">
                            <h3 className="font-semibold text-sm text-foreground">Notes</h3>
                            <Switch
                              checked={!!confirmedFields[fieldKey('notes')]}
                              onCheckedChange={() => toggleConfirm(fieldKey('notes'))}
                              className={cn('ml-auto', confirmedFields[fieldKey('notes')] ? 'opacity-100' : 'opacity-50')}
                            />
                          </div>
                          <Textarea
                            value={currentSlideData.notes || ''}
                            onChange={handleNotesChange}
                            placeholder="Any notes..."
                            className="text-sm h-16"
                            onKeyDown={(e) => handleEnterConfirm(fieldKey('notes'), e)}
                          />
                        </div>

                        {/* Additional Elements */}
                        <div>
                          <div className="flex items-center mb-1">
                            <h3 className="font-semibold text-sm text-foreground">Additional Elements</h3>
                            <Switch
                              checked={!!confirmedFields[fieldKey('additional_elements')]}
                              onCheckedChange={() => toggleConfirm(fieldKey('additional_elements'))}
                              className={cn('ml-auto', confirmedFields[fieldKey('additional_elements')] ? 'opacity-100' : 'opacity-50')}
                            />
                          </div>
                          <Textarea
                            value={currentSlideData.additional_elements || ''}
                            onChange={handleAdditionalElementsChange}
                            placeholder="Additional elements..."
                            className="text-sm h-16"
                            onKeyDown={(e) => handleEnterConfirm(fieldKey('additional_elements'), e)}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={confirmSlide}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Confirm Slide
                      </button>
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
