import { Room, TargetMachine, CommandOutput } from '../types/cyber';

/**
 * Validates a flag or text answer against expected acceptable answers.
 * Trims whitespace and is case-insensitive for standard flags,
 * but allows strict exact match if needed.
 */
export function verifyFlag(userAnswer: string, expectedAnswers: string[]): boolean {
  if (!userAnswer || !userAnswer.trim()) {
    return false;
  }
  const normalizedUser = userAnswer.trim().toLowerCase();

  return expectedAnswers.some((expected) => {
    const normalizedExpected = expected.trim().toLowerCase();
    return normalizedUser === normalizedExpected;
  });
}

/**
 * Calculates level, rank title, and progress percentage from total XP.
 */
export function calculateLevelAndRank(xp: number): {
  level: number;
  rankTitle: string;
  progressPercent: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
} {
  const safeXp = Math.max(0, xp);
  // 500 XP per level
  const xpPerLevel = 500;
  const level = Math.floor(safeXp / xpPerLevel) + 1;
  const xpInCurrentLevel = safeXp % xpPerLevel;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpPerLevel) * 100));

  let rankTitle = 'Script Kiddie';
  if (level >= 10) rankTitle = 'Omni Root God';
  else if (level >= 8) rankTitle = 'Red Team Lead';
  else if (level >= 6) rankTitle = 'Exploit Developer';
  else if (level >= 4) rankTitle = 'Security Researcher';
  else if (level >= 2) rankTitle = 'Hacker Associate';

  return {
    level,
    rankTitle,
    progressPercent,
    xpForCurrentLevel: (level - 1) * xpPerLevel,
    xpForNextLevel: level * xpPerLevel,
  };
}

/**
 * Computes completion percentage of a room based on solved questions.
 */
export function calculateRoomProgress(room: Room, solvedQuestionIds: Record<string, boolean>): {
  totalQuestions: number;
  solvedCount: number;
  percent: number;
  isComplete: boolean;
} {
  let totalQuestions = 0;
  let solvedCount = 0;

  for (const task of room.tasks) {
    for (const q of task.questions) {
      totalQuestions += 1;
      if (solvedQuestionIds[q.id]) {
        solvedCount += 1;
      }
    }
  }

  const percent = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;
  return {
    totalQuestions,
    solvedCount,
    percent,
    isComplete: totalQuestions > 0 && solvedCount === totalQuestions,
  };
}

/**
 * Filters rooms by search query, category, and difficulty.
 */
export function filterRooms(
  rooms: Room[],
  query: string,
  category: string,
  difficulty: string,
  onlyCompleted: boolean,
  solvedQuestionIds: Record<string, boolean>
): Room[] {
  const cleanQuery = query.trim().toLowerCase();

  return rooms.filter((room) => {
    // Category match
    if (category !== 'All' && room.category !== category) {
      return false;
    }

    // Difficulty match
    if (difficulty !== 'All' && room.difficulty !== difficulty) {
      return false;
    }

    // Completed filter
    if (onlyCompleted) {
      const { isComplete } = calculateRoomProgress(room, solvedQuestionIds);
      if (!isComplete) return false;
    }

    // Text search query
    if (cleanQuery) {
      const matchTitle = room.title.toLowerCase().includes(cleanQuery);
      const matchDesc = room.description.toLowerCase().includes(cleanQuery);
      const matchTag = room.tags.some((t) => t.toLowerCase().includes(cleanQuery));
      if (!matchTitle && !matchDesc && !matchTag) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Virtual Linux terminal command interpreter for AttackBox simulation.
 */
export function executeVirtualCommand(
  rawCmd: string,
  targetMachine: TargetMachine | null,
  currentDirectory: string = '/home/rootforge'
): { outputLines: string[]; newDir: string; clearScreen?: boolean } {
  const trimmed = rawCmd.trim();
  if (!trimmed) {
    return { outputLines: [], newDir: currentDirectory };
  }

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (command === 'clear') {
    return { outputLines: [], newDir: currentDirectory, clearScreen: true };
  }

  if (command === 'whoami') {
    return {
      outputLines: ['rootforge (uid=1000, gid=1000, groups=1000, sudo, docker)'],
      newDir: currentDirectory,
    };
  }

  if (command === 'id') {
    return {
      outputLines: ['uid=1000(rootforge) gid=1000(rootforge) groups=1000(rootforge),27(sudo),999(docker)'],
      newDir: currentDirectory,
    };
  }

  if (command === 'uname' && (args.includes('-a') || args.includes('-r'))) {
    return {
      outputLines: ['Linux attackbox 6.5.0-kali3-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.5.3-1 x86_64 GNU/Linux'],
      newDir: currentDirectory,
    };
  }

  if (command === 'pwd') {
    return {
      outputLines: [currentDirectory],
      newDir: currentDirectory,
    };
  }

  if (command === 'ls') {
    if (currentDirectory === '/home/rootforge') {
      return {
        outputLines: [
          'Desktop   Downloads   Documents   wordlists/   tools/   notes.txt   target.ip',
        ],
        newDir: currentDirectory,
      };
    }
    return {
      outputLines: ['file1.txt   exploit.py   README.md'],
      newDir: currentDirectory,
    };
  }

  if (command === 'cd') {
    const target = args[0] || '/home/rootforge';
    if (target === '..' || target === '../') {
      return { outputLines: [], newDir: '/home' };
    }
    if (target === '~' || target === '/home/rootforge') {
      return { outputLines: [], newDir: '/home/rootforge' };
    }
    return { outputLines: [], newDir: `/home/rootforge/${target.replace(/^\//, '')}` };
  }

  if (command === 'cat') {
    const target = args[0];
    if (target === 'target.ip') {
      if (targetMachine && targetMachine.status === 'online') {
        return {
          outputLines: [`${targetMachine.ip} (${targetMachine.hostname})`],
          newDir: currentDirectory,
        };
      }
      return {
        outputLines: ['No target machine deployed. Deploy a machine from the room briefing!'],
        newDir: currentDirectory,
      };
    }
    if (target === 'notes.txt') {
      return {
        outputLines: [
          '[RootForge Notes]',
          'Remember: TryHackMe without limits gives you 24/7 unlimited AttackBox access.',
          'Always run nmap with -sC -sV against the target IP.',
          'Inspect directory listings with gobuster or dirb.',
        ],
        newDir: currentDirectory,
      };
    }
    if (target === '/etc/passwd') {
      return {
        outputLines: [
          'root:x:0:0:root:/root:/bin/bash',
          'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin',
          'rootforge:x:1000:1000:RootForge Lab User,,,:/home/rootforge:/bin/bash',
        ],
        newDir: currentDirectory,
      };
    }
    return {
      outputLines: [`cat: ${target || 'missing operand'}: No such file or directory`],
      newDir: currentDirectory,
    };
  }

  if (command === 'ping') {
    const ip = args.find((a) => !a.startsWith('-')) || (targetMachine ? targetMachine.ip : '10.10.142.87');
    if (!targetMachine || targetMachine.status !== 'online') {
      return {
        outputLines: [
          `PING ${ip} (${ip}) 56(84) bytes of data.`,
          `From 10.10.100.1 icmp_seq=1 Destination Host Unreachable`,
          `From 10.10.100.1 icmp_seq=2 Destination Host Unreachable`,
          `--- ${ip} ping statistics ---`,
          `2 packets transmitted, 0 received, +2 errors, 100% packet loss`,
          `Hint: Make sure to click "Deploy Machine" first!`,
        ],
        newDir: currentDirectory,
      };
    }
    return {
      outputLines: [
        `PING ${ip} (${ip}) 56(84) bytes of data.`,
        `64 bytes from ${ip}: icmp_seq=1 ttl=64 time=18.4 ms`,
        `64 bytes from ${ip}: icmp_seq=2 ttl=64 time=17.2 ms`,
        `64 bytes from ${ip}: icmp_seq=3 ttl=64 time=17.9 ms`,
        `--- ${ip} ping statistics ---`,
        `3 packets transmitted, 3 received, 0% packet loss, time 2002ms`,
      ],
      newDir: currentDirectory,
    };
  }

  if (command === 'nmap') {
    if (!targetMachine || targetMachine.status !== 'online') {
      return {
        outputLines: [
          'Starting Nmap 7.94 ( https://nmap.org ) at ' + new Date().toISOString().slice(0, 19).replace('T', ' '),
          'Note: Host seems down. If it is really up, but blocking our ping probes, try -Pn',
          'Nmap done: 1 IP address (0 hosts up) scanned in 2.05 seconds',
          'Tip: Deploy the target machine in the room page to boot up the virtual lab host.',
        ],
        newDir: currentDirectory,
      };
    }

    const lines = [
      `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`,
      `Nmap scan report for ${targetMachine.hostname} (${targetMachine.ip})`,
      `Host is up (0.018s latency).`,
      `Not shown: 997 closed tcp ports (reset)`,
      `PORT     STATE SERVICE VERSION`,
    ];

    for (const p of targetMachine.openPorts) {
      const portCol = `${p.port}/${p.protocol}`.padEnd(9, ' ');
      const stateCol = p.state.padEnd(8, ' ');
      const serviceCol = p.service.padEnd(10, ' ');
      lines.push(`${portCol}${stateCol}${serviceCol}${p.version}`);
    }

    lines.push(`Service detection performed. Please report any incorrect results.`);
    lines.push(`Nmap done: 1 IP address (1 host up) scanned in 4.38 seconds`);

    return {
      outputLines: lines,
      newDir: currentDirectory,
    };
  }

  if (command === 'gobuster') {
    if (!targetMachine || targetMachine.status !== 'online') {
      return {
        outputLines: ['Error: unable to connect to target. Target host unreachable.'],
        newDir: currentDirectory,
      };
    }
    return {
      outputLines: [
        '===============================================================',
        'Gobuster v3.6 - directory & file enumeration',
        `Target URL: http://${targetMachine.ip}/`,
        'Threads: 10 | Wordlist: /usr/share/wordlists/dirb/common.txt',
        '===============================================================',
        `/.hta                 (Status: 403) [Size: 279]`,
        `/.htaccess            (Status: 403) [Size: 279]`,
        `/admin                (Status: 301) [Size: 312] --> /admin/login`,
        `/assets               (Status: 301) [Size: 178]`,
        `/api                  (Status: 200) [Size: 64]`,
        `/robots.txt           (Status: 200) [Size: 45]`,
        `/portal               (Status: 200) [Size: 1845]`,
        '===============================================================',
        'Finished in 2.14s - 4614 requests sent',
      ],
      newDir: currentDirectory,
    };
  }

  if (command === 'curl') {
    if (!targetMachine || targetMachine.status !== 'online') {
      return {
        outputLines: ['curl: (7) Failed to connect to host: Connection refused'],
        newDir: currentDirectory,
      };
    }
    const url = args.find((a) => a.includes('http') || a.includes(targetMachine.ip)) || '';
    if (url.includes('/admin') || url.includes('/login')) {
      return {
        outputLines: [
          'HTTP/1.1 200 OK',
          'Server: Apache/2.4.52 (Ubuntu)',
          'Content-Type: text/html; charset=UTF-8',
          '',
          '<!DOCTYPE html>',
          '<html><head><title>VaultSec Admin Portal</title></head>',
          '<body><h2>Admin Authentication</h2>',
          '<form action="/login" method="POST">',
          '  <input name="username" placeholder="Username" />',
          '  <input name="password" type="password" placeholder="Password" />',
          '  <button type="submit">Login</button>',
          '</form>',
          '<!-- DEBUG: SQL query format: SELECT * FROM users WHERE user=\'$user\' AND pass=\'$pass\' -->',
          '</body></html>',
        ],
        newDir: currentDirectory,
      };
    }

    if (url.includes('robots.txt')) {
      return {
        outputLines: [
          'User-agent: *',
          'Disallow: /super_secret_backdoor_panel.php',
          'Disallow: /backup.sql.tar.gz',
          '# THM{robots_file_enumeration_success}',
        ],
        newDir: currentDirectory,
      };
    }

    return {
      outputLines: [
        `<!DOCTYPE html><html><head><title>${targetMachine.hostname}</title></head>`,
        `<body><h1>Welcome to ${targetMachine.hostname} Intranet</h1>`,
        '<p>RootForge Lab target server running vulnerable software stack.</p>',
        '<a href="/admin">Admin Portal</a> | <a href="/portal">Employee Portal</a>',
        '</body></html>',
      ],
      newDir: currentDirectory,
    };
  }

  if (command === 'sqlmap') {
    return {
      outputLines: [
        '        ___',
        '       __H__',
        ' ___ ___[)]_____ ___ ___  {1.7.11#stable}',
        '|_ -| . ["]     | .\'| . |',
        '|___|_  ["]_|_|_|__,|  _|',
        '      |_|V...       |_|   https://sqlmap.org',
        '',
        '[*] testing connection to the target URL',
        '[*] checking if the target is protected by some kind of WAF/IPS',
        '[*] testing if the parameter \'username\' is dynamic',
        '[+] GET parameter \'username\' is vulnerable. Do you want to keep testing the others? [y/N] N',
        'sqlmap identified the following injection point(s) with a total of 56 HTTP(s) requests:',
        '---',
        'Parameter: username (POST)',
        '    Type: boolean-based blind',
        '    Title: OR boolean-based blind - WHERE or HAVING clause',
        '    Payload: username=\' OR 1=1 -- -',
        '---',
        '[INFO] the back-end DBMS is MySQL >= 5.0.12',
        '[INFO] fetching database: \'vaultsec_db\'',
        '[INFO] dumping table users: admin | pass: $2a$12$e8F... | Flag: THM{unrestricted_sql_bypass_2026}',
      ],
      newDir: currentDirectory,
    };
  }

  if (command === 'john' || command === 'hashcat') {
    return {
      outputLines: [
        'Loaded 1 password hash (bcrypt $2a$12)',
        'Press \'q\' or Ctrl-C to abort, almost any other key for status',
        'hunter2          (?)',
        '1g 0:00:00:01 100% 0.7633g/s 12.21p/s 12.21c/s 12.21C/s hunter2..password123',
        'Use the "--show" option to display all of the cracked passwords reliably',
        'Session completed: Cracked password is "hunter2"',
      ],
      newDir: currentDirectory,
    };
  }

  if (command === 'help') {
    return {
      outputLines: [
        'RootForge Unlimited AttackBox - Command Help:',
        '  nmap <options> <ip>    : Scan target machine ports & services',
        '  ping <ip>              : Test network connectivity to target host',
        '  gobuster dir -u <url>  : Enumerate hidden directories and web endpoints',
        '  curl <url>             : Inspect raw HTTP responses and page source',
        '  sqlmap -u <url>        : Automate SQL injection testing',
        '  john / hashcat         : Password cracking simulation',
        '  whoami / id / uname -a : User and system information',
        '  ls / cat / cd / pwd    : File system navigation',
        '  clear                  : Clear terminal screen',
      ],
      newDir: currentDirectory,
    };
  }

  return {
    outputLines: [
      `bash: ${command}: command not found. Type 'help' for available hacker tools.`,
    ],
    newDir: currentDirectory,
  };
}
