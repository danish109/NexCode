import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, ChevronRight, Code, Terminal, Clipboard, Clock, Cpu, HardDrive } from 'lucide-react';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);
  let { problemId } = useParams();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage])?.initialCode || '';
        
        setProblem(response.data);
        setCode(initialCode);
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage])?.initialCode || '';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(response.data);
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: error.response?.data?.message || 'Internal server error',
        testCases: []
      });
      setActiveRightTab('testcase');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: code,
        language: selectedLanguage
      });

      setSubmitResult(response.data);
      setActiveRightTab('result');
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult({
        accepted: false,
        error: error.response?.data?.message || 'Submission failed',
        passedTestCases: 0,
        totalTestCases: 0
      });
      setActiveRightTab('result');
    } finally {
      setLoading(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'hard': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-700">
        {/* Left Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {['description', 'editorial', 'submissions', 'chatAI'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-3 text-sm font-medium relative ${activeLeftTab === tab ? 'text-yellow-600 dark:text-yellow-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              onClick={() => setActiveLeftTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeLeftTab === tab && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"
                  layoutId="leftTabIndicator"
                />
              )}
            </button>
          ))}
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-800">
          {problem && (
            <>
              {activeLeftTab === 'description' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold">{problem.title}</h1>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {problem.tags.split(',').map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium dark:bg-blue-900/30 dark:text-blue-300">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {problem.description}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Examples:</h3>
                    <div className="space-y-4">
                      {problem.visibleTestCases.map((example, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
                          <div className="space-y-2 text-sm font-mono">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <strong>Input:</strong>
                                <button 
                                  onClick={() => copyToClipboard(example.input)}
                                  className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                  {copied ? 'Copied!' : <><Clipboard size={14} /> Copy</>}
                                </button>
                              </div>
                              <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">{example.input}</pre>
                            </div>
                            <div>
                              <strong>Output:</strong>
                              <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">{example.output}</pre>
                            </div>
                            {example.explanation && (
                              <div>
                                <strong>Explanation:</strong>
                                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">{example.explanation}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeLeftTab === 'editorial' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Editorial 
                    secureUrl={problem.secureUrl} 
                    thumbnailUrl={problem.thumbnailUrl} 
                    duration={problem.duration}
                  />
                </motion.div>
              )}
             
              {activeLeftTab === 'solutions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Solutions</h2>
                  <div className="space-y-6">
                    {problem.referenceSolution?.map((solution, index) => (
                      <div key={index} className="border border-base-300 rounded-lg">
                        <div className="bg-base-200 px-4 py-2 rounded-t-lg">
                          <h3 className="font-semibold">{problem?.title} - {solution?.language}</h3>
                        </div>
                        <div className="p-4">
                          <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
                            <code>{solution?.completeCode}</code>
                          </pre>
                        </div>
                      </div>
                    )) || <p className="text-gray-500">Solutions will be available after you solve the problem.</p>}
                  </div>
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <SubmissionHistory problemId={problemId} />
                </motion.div>
              )}

              {activeLeftTab === 'chatAI' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <ChatAi problem={problem} />
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col border-l border-gray-200 dark:border-gray-700">
        {/* Right Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {['code', 'testcase', 'result'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${activeRightTab === tab ? 'text-yellow-600 dark:text-yellow-500' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              onClick={() => setActiveRightTab(tab)}
            >
              {tab === 'code' && <Code size={16} />}
              {tab === 'testcase' && <Terminal size={16} />}
              {tab === 'result' && <CheckCircle size={16} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeRightTab === tab && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"
                  layoutId="rightTabIndicator"
                />
              )}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
          <AnimatePresence mode="wait">
            {activeRightTab === 'code' && (
              <motion.div
                key="code"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col"
              >
                {/* Language Selector */}
                <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex gap-2">
                    {['javascript', 'java', 'cpp'].map((lang) => (
                      <button
                        key={lang}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${selectedLanguage === lang ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                        onClick={() => handleLanguageChange(lang)}
                      >
                        {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1">
                  <Editor
                    height="100%"
                    language={getLanguageForMonaco(selectedLanguage)}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      glyphMargin: false,
                      folding: true,
                      lineDecorationsWidth: 10,
                      lineNumbersMinChars: 3,
                      renderLineHighlight: 'line',
                      selectOnLineNumbers: true,
                      roundedSelection: false,
                      readOnly: false,
                      cursorStyle: 'line',
                      mouseWheelZoom: true,
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between">
                  <div className="flex gap-2">
                    <button 
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 flex items-center gap-1"
                      onClick={() => setActiveRightTab('testcase')}
                    >
                      <Terminal size={14} /> Console
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-1.5 text-xs font-medium rounded-md border border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-gray-700 flex items-center gap-1 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      onClick={handleRun}
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Run
                    </button>
                    <button
                      className={`px-4 py-1.5 text-xs font-medium rounded-md bg-yellow-500 text-white hover:bg-yellow-600 flex items-center gap-1 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      onClick={handleSubmitCode}
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Submit
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeRightTab === 'testcase' && (
              <motion.div
                key="testcase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 p-4 overflow-y-auto"
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Terminal size={18} /> Test Results
                </h3>
                {runResult ? (
                  <div className={`rounded-lg border ${runResult.success ? 'border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/10' : 'border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10'} p-4 mb-4`}>
                    {runResult.success ? (
                      <div>
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-3">
                          <CheckCircle size={20} />
                          <h4 className="font-bold">All test cases passed!</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-gray-500" />
                            <span>Runtime: <span className="font-mono">{runResult.runtime} sec</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <HardDrive size={16} className="text-gray-500" />
                            <span>Memory: <span className="font-mono">{runResult.memory} KB</span></span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {runResult.testCases.map((tc, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                              <div className="font-mono text-xs space-y-2">
                                <div>
                                  <div className="text-gray-500 mb-1">Input:</div>
                                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">{tc.stdin}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500 mb-1">Expected Output:</div>
                                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">{tc.expected_output}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500 mb-1">Your Output:</div>
                                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">{tc.stdout}</div>
                                </div>
                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                  <CheckCircle size={14} /> Passed
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-3">
                          <XCircle size={20} />
                          <h4 className="font-bold">{runResult.error || 'Test cases failed'}</h4>
                        </div>
                        <div className="space-y-3">
                          {runResult.testCases?.map((tc, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                              <div className="font-mono text-xs space-y-2">
                                <div>
                                  <div className="text-gray-500 mb-1">Input:</div>
                                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">{tc.stdin}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500 mb-1">Expected Output:</div>
                                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">{tc.expected_output}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500 mb-1">Your Output:</div>
                                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">{tc.stdout}</div>
                                </div>
                                <div className={`flex items-center gap-1 ${tc.status_id === 3 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                  {tc.status_id === 3 ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                  {tc.status_id === 3 ? 'Passed' : 'Failed'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Terminal size={24} className="mx-auto mb-2" />
                    <p>Run your code to see test results</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeRightTab === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 p-4 overflow-y-auto"
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle size={18} /> Submission Result
                </h3>
                {submitResult ? (
                  <div className={`rounded-lg border ${submitResult.accepted ? 'border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/10' : 'border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10'} p-4 mb-4`}>
                    {submitResult.accepted ? (
                      <div>
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-3">
                          <CheckCircle size={20} />
                          <h4 className="font-bold text-lg">Accepted</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-gray-500" />
                            <span>Test Cases: <span className="font-mono">{submitResult.passedTestCases}/{submitResult.totalTestCases}</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-gray-500" />
                            <span>Runtime: <span className="font-mono">{submitResult.runtime} sec</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Cpu size={16} className="text-gray-500" />
                            <span>Beats: <span className="font-mono">{submitResult.beats || 'N/A'}</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <HardDrive size={16} className="text-gray-500" />
                            <span>Memory: <span className="font-mono">{submitResult.memory} KB</span></span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-3">
                          <XCircle size={20} />
                          <h4 className="font-bold text-lg">{submitResult.error || 'Submission Failed'}</h4>
                        </div>
                        <div className="text-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <XCircle size={16} className="text-gray-500" />
                            <span>Test Cases Passed: <span className="font-mono">{submitResult.passedTestCases}/{submitResult.totalTestCases}</span></span>
                          </div>
                          {submitResult.runtime && (
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-gray-500" />
                              <span>Runtime: <span className="font-mono">{submitResult.runtime} sec</span></span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Code size={24} className="mx-auto mb-2" />
                    <p>Submit your code to see results</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;