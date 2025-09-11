'use client';

import React, { useState, useEffect } from 'react';
import { accessibilityTester, AccessibilityIssue } from '@/lib/accessibility-testing';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface AccessibilityTesterProps {
  enabled?: boolean;
  autoRun?: boolean;
}

export function AccessibilityTester({ 
  enabled = process.env.NODE_ENV === 'development',
  autoRun = false 
}: AccessibilityTesterProps) {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
  });

  const runTests = async () => {
    setIsRunning(true);
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundIssues = accessibilityTester.runAllTests();
    const report = accessibilityTester.generateReport();
    
    setIssues(foundIssues);
    setSummary(report.summary);
    setShowResults(true);
    setIsRunning(false);
  };

  useEffect(() => {
    if (autoRun && enabled) {
      // Run tests after page load
      setTimeout(runTests, 2000);
    }
  }, [autoRun, enabled]);

  if (!enabled) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'serious': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'minor': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '•';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      {!showResults ? (
        <Card className="p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Accessibility Tester</h3>
            <span className="text-xs text-gray-500">DEV ONLY</span>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Test this page for WCAG AA compliance issues.
          </p>
          
          <Button
            onClick={runTests}
            loading={isRunning}
            disabled={isRunning}
            size="sm"
            className="w-full"
          >
            {isRunning ? 'Running Tests...' : 'Run Accessibility Tests'}
          </Button>
        </Card>
      ) : (
        <Card className="p-4 shadow-lg max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">
              Accessibility Report
            </h3>
            <button
              onClick={() => setShowResults(false)}
              className="text-gray-600 hover:text-gray-800"
              aria-label="Close report"
            >
              ✕
            </button>
          </div>
          
          {/* Summary */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900 mb-2">
              Summary: {summary.total} issues found
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span>Critical:</span>
                <span className="font-medium text-red-600">{summary.critical}</span>
              </div>
              <div className="flex justify-between">
                <span>Serious:</span>
                <span className="font-medium text-orange-600">{summary.serious}</span>
              </div>
              <div className="flex justify-between">
                <span>Moderate:</span>
                <span className="font-medium text-yellow-600">{summary.moderate}</span>
              </div>
              <div className="flex justify-between">
                <span>Minor:</span>
                <span className="font-medium text-blue-600">{summary.minor}</span>
              </div>
            </div>
          </div>
          
          {/* Issues List */}
          {issues.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-2xl mb-2">🎉</div>
              <div className="text-sm font-medium text-green-600">
                No accessibility issues found!
              </div>
              <div className="text-xs text-gray-500 mt-1">
                This page meets WCAG AA standards.
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {issues.map((issue, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border text-xs ${getSeverityColor(issue.severity)}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0">
                      {getTypeIcon(issue.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {issue.rule}
                      </div>
                      <div className="mt-1 text-xs opacity-90">
                        {issue.message}
                      </div>
                      {issue.element && (
                        <div className="mt-1 text-xs opacity-75 font-mono">
                          {issue.element.tagName.toLowerCase()}
                          {issue.element.className && `.${issue.element.className.split(' ')[0]}`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Actions */}
          <div className="mt-4 pt-3 border-t border-gray-200 flex gap-2">
            <Button
              onClick={runTests}
              loading={isRunning}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              Re-run Tests
            </Button>
            <Button
              onClick={() => {
                console.log('Accessibility Report:', { summary, issues });
                alert('Report logged to console');
              }}
              size="sm"
              variant="ghost"
              className="flex-1"
            >
              Log Report
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default AccessibilityTester;