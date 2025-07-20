

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const SimpleDatabaseTest = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, result, error = null) => {
    setResults(prev => [...prev, { test, result, error, timestamp: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setResults([]);
    setLoading(true);

    try {
      // Test 1: Check auth
      addResult('Auth Check', 'Starting...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        addResult('Auth Check', 'FAILED', authError.message);
        setLoading(false);
        return;
      }
      addResult('Auth Check', `SUCCESS - User ID: ${user?.id}`);

      // Test 2: Check if tables exist
      const tables = ['user_profiles', 'user_favorited_courses', 'user_enrolled_courses'];
      
      for (const table of tables) {
        addResult(`Table ${table}`, 'Checking...');
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1);
          
          if (error) {
            addResult(`Table ${table}`, 'FAILED', error.message);
          } else {
            addResult(`Table ${table}`, 'SUCCESS');
          }
        } catch (err) {
          addResult(`Table ${table}`, 'FAILED', err.message);
        }
      }

      // Test 3: Try simple insert
      if (user) {
        addResult('Test Insert', 'Trying favorite insert...');
        const { data: insertData, error: insertError } = await supabase
          .from('user_favorited_courses')
          .insert({
            user_id: user.id,
            course_id: '999999',
            favorited_at: new Date().toISOString()
          })
          .select();
        
        if (insertError) {
          addResult('Test Insert', 'FAILED', insertError.message);
        } else {
          addResult('Test Insert', 'SUCCESS');
          
          // Clean up
          await supabase
            .from('user_favorited_courses')
            .delete()
            .eq('user_id', user.id)
            .eq('course_id', '999999');
          
          addResult('Cleanup', 'SUCCESS');
        }
      }

    } catch (error) {
      addResult('Unexpected Error', 'FAILED', error.message);
    }

    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      border: '2px solid #dc3545',
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '400px',
      maxHeight: '400px',
      overflow: 'auto',
      zIndex: 9999,
      fontSize: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#dc3545' }}>Database Test</h3>
      
      <button 
        onClick={runTests} 
        disabled={loading}
        style={{
          background: '#dc3545',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '15px'
        }}
      >
        {loading ? 'Testing...' : 'Run Tests'}
      </button>

      <div style={{ 
        background: '#f8f9fa', 
        padding: '10px', 
        borderRadius: '4px',
        maxHeight: '250px',
        overflow: 'auto'
      }}>
        {results.length === 0 ? (
          <div style={{ color: '#666', fontStyle: 'italic' }}>
            Click "Run Tests" to start
          </div>
        ) : (
          results.map((result, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '5px',
                padding: '5px',
                borderLeft: `3px solid ${result.error ? '#dc3545' : '#28a745'}`,
                backgroundColor: result.error ? '#f8d7da' : '#d4edda'
              }}
            >
              <strong>{result.test}:</strong> {result.result}
              {result.error && (
                <div style={{ fontSize: '10px', color: '#721c24', marginTop: '2px' }}>
                  Error: {result.error}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SimpleDatabaseTest;
