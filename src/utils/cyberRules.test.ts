import test from 'node:test';
import assert from 'node:assert/strict';
import {
  verifyFlag,
  calculateLevelAndRank,
  calculateRoomProgress,
  executeVirtualCommand,
  filterRooms,
} from './cyberRules.ts';
import { Room } from '../types/cyber.ts';

test('verifyFlag checks flags with case-insensitivity and whitespace trimming', () => {
  const expected = ['THM{unrestricted_sql_bypass_2026}', 'sql_bypass_2026'];

  assert.equal(verifyFlag('THM{unrestricted_sql_bypass_2026}', expected), true);
  assert.equal(verifyFlag('  thm{unrestricted_sql_bypass_2026}  ', expected), true);
  assert.equal(verifyFlag('sql_bypass_2026', expected), true);
  assert.equal(verifyFlag('wrong_flag', expected), false);
  assert.equal(verifyFlag('', expected), false);
  assert.equal(verifyFlag('   ', expected), false);
});

test('calculateLevelAndRank computes correct rank and progress levels', () => {
  const rank0 = calculateLevelAndRank(0);
  assert.equal(rank0.level, 1);
  assert.equal(rank0.rankTitle, 'Script Kiddie');
  assert.equal(rank0.progressPercent, 0);

  const rank250 = calculateLevelAndRank(250);
  assert.equal(rank250.level, 1);
  assert.equal(rank250.progressPercent, 50);

  const rank500 = calculateLevelAndRank(500);
  assert.equal(rank500.level, 2);
  assert.equal(rank500.rankTitle, 'Hacker Associate');

  const rankHigh = calculateLevelAndRank(5000);
  assert.equal(rankHigh.level, 11);
  assert.equal(rankHigh.rankTitle, 'Omni Root God');
});

test('calculateRoomProgress counts questions and completion correctly', () => {
  const mockRoom: Room = {
    id: 'room-1',
    title: 'Test Room',
    slug: 'test-room',
    category: 'Web Exploitation',
    difficulty: 'Easy',
    estimatedMinutes: 30,
    totalXp: 100,
    description: 'Test description',
    image: '',
    tags: ['web'],
    isVipOnlyInOriginalTHM: false,
    targetMachine: {
      ip: '10.10.10.10',
      hostname: 'target.lab',
      os: 'Linux Ubuntu 22.04 LTS',
      status: 'offline',
      uptimeSeconds: 0,
      openPorts: [],
    },
    tasks: [
      {
        id: 'task-1',
        title: 'Task 1',
        description: 'Do task 1',
        questions: [
          { id: 'q1', prompt: 'Q1', expectedAnswers: ['a'], points: 20 },
          { id: 'q2', prompt: 'Q2', expectedAnswers: ['b'], points: 20 },
        ],
      },
      {
        id: 'task-2',
        title: 'Task 2',
        description: 'Do task 2',
        questions: [
          { id: 'q3', prompt: 'Q3', expectedAnswers: ['c'], points: 20 },
        ],
      },
    ],
  };

  const progressInitial = calculateRoomProgress(mockRoom, {});
  assert.equal(progressInitial.totalQuestions, 3);
  assert.equal(progressInitial.solvedCount, 0);
  assert.equal(progressInitial.percent, 0);
  assert.equal(progressInitial.isComplete, false);

  const progressPartial = calculateRoomProgress(mockRoom, { q1: true });
  assert.equal(progressPartial.solvedCount, 1);
  assert.equal(progressPartial.percent, 33);
  assert.equal(progressPartial.isComplete, false);

  const progressComplete = calculateRoomProgress(mockRoom, { q1: true, q2: true, q3: true });
  assert.equal(progressComplete.solvedCount, 3);
  assert.equal(progressComplete.percent, 100);
  assert.equal(progressComplete.isComplete, true);
});

test('executeVirtualCommand handles basic commands and status simulation', () => {
  const whoamiRes = executeVirtualCommand('whoami', null);
  assert.match(whoamiRes.outputLines[0], /rootforge/);

  const clearRes = executeVirtualCommand('clear', null);
  assert.equal(clearRes.clearScreen, true);

  const unknownRes = executeVirtualCommand('some_weird_tool', null);
  assert.match(unknownRes.outputLines[0], /command not found/);
});

test('filterRooms filters by query, category, and difficulty', () => {
  const rooms: Room[] = [
    {
      id: 'r1',
      title: 'SQL Injection Fundamentals',
      slug: 'sqli',
      category: 'Web Exploitation',
      difficulty: 'Easy',
      estimatedMinutes: 20,
      totalXp: 50,
      description: 'Learn SQLi vulnerabilities',
      image: '',
      tags: ['sql', 'web'],
      isVipOnlyInOriginalTHM: true,
      targetMachine: {
        ip: '10.10.1.1',
        hostname: 'web.lab',
        os: 'Linux Ubuntu 22.04 LTS',
        status: 'offline',
        uptimeSeconds: 0,
        openPorts: [],
      },
      tasks: [],
    },
    {
      id: 'r2',
      title: 'Linux PrivEsc SUID Exploitation',
      slug: 'privesc',
      category: 'Privilege Escalation',
      difficulty: 'Medium',
      estimatedMinutes: 45,
      totalXp: 120,
      description: 'Find SUID binaries and root the box',
      image: '',
      tags: ['linux', 'root'],
      isVipOnlyInOriginalTHM: true,
      targetMachine: {
        ip: '10.10.1.2',
        hostname: 'priv.lab',
        os: 'Debian 11',
        status: 'offline',
        uptimeSeconds: 0,
        openPorts: [],
      },
      tasks: [],
    },
  ];

  const filteredByCat = filterRooms(rooms, '', 'Web Exploitation', 'All', false, {});
  assert.equal(filteredByCat.length, 1);
  assert.equal(filteredByCat[0].id, 'r1');

  const filteredByQuery = filterRooms(rooms, 'SUID', 'All', 'All', false, {});
  assert.equal(filteredByQuery.length, 1);
  assert.equal(filteredByQuery[0].id, 'r2');
});
