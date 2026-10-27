import { Room, LearningPath } from '../types/cyber';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'tutorial-bootcamp',
    title: 'Tutorial: Erste Schritte für absolute Anfänger (Kostenlos)',
    slug: 'rootforge-bootcamp-tutorial',
    category: 'All',
    difficulty: 'Easy',
    estimatedMinutes: 10,
    totalXp: 150,
    description:
      'Du hast noch nie mit Hacking, Linux oder Netzwerken gearbeitet? Perfekt! Dieser Raum erklärt dir alles Schritt für Schritt wie in einem Spiel: Maschinen starten, Terminal bedienen und deine erste Flagge einsammeln.',
    image: '/src/assets/images/hero_cyber_range_1793101202349.jpg',
    tags: ['Anfänger', 'Tutorial', 'Schritt-für-Schritt', 'Zero Limits', 'Getting Started'],
    isVipOnlyInOriginalTHM: false,
    targetMachine: {
      ip: '10.10.100.1',
      hostname: 'bootcamp.thm',
      os: 'Linux Ubuntu 22.04 LTS',
      status: 'offline',
      uptimeSeconds: 0,
      openPorts: [
        { port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 8.9p1', state: 'open' },
        { port: 80, protocol: 'tcp', service: 'http', version: 'RootForge Tutorial Web 1.0', state: 'open' },
      ],
      webApp: {
        title: 'RootForge Anfänger-Portal (Klick-für-Klick)',
        type: 'tutorial_portal',
        path: '/welcome',
      },
    },
    tasks: [
      {
        id: 'task-tut-1',
        title: 'Schritt 1: Ziel-Maschine starten & IP-Adresse verstehen',
        description:
          '👉 Was du tun musst: Klicke oben auf den grünen Button "Deploy Free Machine". Innerhalb von 1 Sekunde startet dein virtueller Ziel-Computer. Du siehst dann oben seine IP-Adresse (10.10.100.1).',
        theory:
          '💡 Einfach erklärt: Stell dir die Ziel-Maschine wie einen Übungs-Computer im Internet vor. Die IP-Adresse (z. B. 10.10.100.1) ist wie eine Telefonnummer oder Hausnummer: Sie sagt deinem Computer, wie er das Ziel erreicht.',
        questions: [
          {
            id: 'q-tut-1',
            prompt: 'Wie lautet die IP-Adresse (die "Hausnummer") der gestarteten Ziel-Maschine?',
            answerHint: 'Klicke oben auf den grünen Button "Deploy Free Machine". Die IP lautet: 10.10.100.1',
            expectedAnswers: ['10.10.100.1', '10.10.100.1/'],
            points: 25,
          },
        ],
      },
      {
        id: 'task-tut-2',
        title: 'Schritt 2: Das Terminal (AttackBox) ausprobieren',
        description:
          '👉 Was du tun musst: Klicke oben auf "Launch AttackBox" (oder den Terminal-Button im Menü). Ein schwarzes Textfenster öffnet sich. Das ist dein Terminal. Führe dort den Befehl `whoami` aus (Tipp: Du kannst auch einfach auf den Schnellbefehl "whoami" unter dem Terminal klicken).',
        theory:
          '💡 Einfach erklärt: Ein Terminal ist ein Textfenster ohne bunte Menüs. Du gibst Befehle mit der Tastatur ein. Der Befehl "whoami" (aus dem Englischen "Who am I?" = "Wer bin ich?") verrät dir, als welcher Benutzer du angemeldet bist.',
        questions: [
          {
            id: 'q-tut-2',
            prompt: 'Welcher einfache Befehl verrät dir im Terminal, wer du bist? (Tipp: Englisch für "Wer bin ich?")',
            answerHint: 'Tippe whoami in das Terminal oder klicke auf den Button "whoami".',
            expectedAnswers: ['whoami', 'whoami command', 'id'],
            points: 25,
          },
        ],
      },
      {
        id: 'task-tut-3',
        title: 'Schritt 3: Die Ziel-Webseite öffnen & deine erste Flagge einsammeln',
        description:
          '👉 Was du tun musst: Klicke oben auf den Reiter "Target Web Browser". Dort siehst du die simulierte Webseite des Ziel-Computers. Klicke auf den großen Button "Willkommens-Flagge abholen". Kopiere den gefundenen Code und füge ihn unten ein!',
        theory:
          '💡 Was ist eine Flagge (Flag)? In Cyber-Übungen ist eine Flagge ein geheimer Code (wie ein Schatz oder Passwort), der meistens mit THM{...} beginnt. Wenn du ihn findest und einreichst, hast du bewiesen, dass du die Aufgabe gelöst hast!',
        questions: [
          {
            id: 'q-tut-3',
            prompt: 'Gib hier deine gefundene Willkommens-Flagge ein:',
            answerHint: 'Klicke im "Target Web Browser" auf "Flagge aufdecken". Der Code lautet THM{welcome_to_unrestricted_rootforge}',
            expectedAnswers: [
              'THM{welcome_to_unrestricted_rootforge}',
              'thm{welcome_to_unrestricted_rootforge}',
              'welcome_to_unrestricted_rootforge',
            ],
            points: 100,
          },
        ],
      },
    ],
  },
  {
    id: 'room-sqli',
    title: 'SQL Injection: Auth Bypass & Data Extraction',
    slug: 'sql-injection-auth-bypass',
    category: 'Web Exploitation',
    difficulty: 'Easy',
    estimatedMinutes: 35,
    totalXp: 180,
    description:
      'Lerne SQL Injection von Grund auf. Finde ungesicherte Datenbankabfragen, umgehe Login-Formulare mit Boolean-Bypass und extrahiere geheime Server-Flags – 100% ohne Abo freigeschaltet.',
    image: '/src/assets/images/room_web_security_1793101201512.jpg',
    tags: ['OWASP Top 10', 'SQLi', 'Database', 'MySQL', 'Web Pentesting'],
    isVipOnlyInOriginalTHM: true,
    targetMachine: {
      ip: '10.10.142.87',
      hostname: 'vaultsec.thm',
      os: 'Linux Ubuntu 22.04 LTS',
      status: 'offline',
      uptimeSeconds: 0,
      openPorts: [
        { port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 8.9p1 Ubuntu', state: 'open' },
        { port: 80, protocol: 'tcp', service: 'http', version: 'Apache httpd 2.4.52', state: 'open' },
        { port: 3306, protocol: 'tcp', service: 'mysql', version: 'MySQL 8.0.32', state: 'open' },
      ],
      webApp: {
        title: 'VaultSec Enterprise Authentication Portal',
        type: 'sqli',
        path: '/login',
      },
    },
    tasks: [
      {
        id: 'task-sqli-1',
        title: 'Task 1: Reconnaissance & Target Discovery',
        description:
          'Starte die Target-Maschine und führe mit dem integrierten AttackBox Terminal einen Nmap-Portscan gegen die Ziel-IP aus. Untersuche, welche Dienste auf dem Server laufen.',
        theory:
          'SQL Injection tritt auf, wenn vom Benutzer kontrollierte Eingaben direkt ohne Parametrisierung oder Prepared Statements in SQL-Queries konkateniert werden. Vor dem Angriff ermitteln wir offene Ports mit Nmap (`nmap -sV -p- <IP>`).',
        questions: [
          {
            id: 'q-sqli-1',
            prompt: 'Welcher Webserver-Dienst läuft auf Port 80 der Zielmaschine?',
            answerHint: 'Führe im Terminal `nmap 10.10.142.87` oder `curl 10.10.142.87` aus.',
            expectedAnswers: ['Apache', 'Apache httpd', 'Apache/2.4.52', 'Apache 2.4.52'],
            points: 30,
          },
          {
            id: 'q-sqli-2',
            prompt: 'Auf welchem Port läuft der MySQL-Datenbankdienst?',
            answerHint: 'Standardport für MySQL.',
            expectedAnswers: ['3306', 'port 3306'],
            points: 20,
          },
        ],
      },
      {
        id: 'task-sqli-2',
        title: 'Task 2: Authentication Bypass & Exploitation',
        description:
          'Öffne den interaktiven Target-Webbrowser und teste das Login-Formular mit einem klassischen SQL-Bypass-Payload (`\' OR 1=1 -- -`).',
        theory:
          'Ein typisches Login-Query lautet: `SELECT * FROM users WHERE username = \'$user\' AND password = \'$pass\'`. Wenn wir als Benutzername `admin\' OR 1=1 --` eingeben, wird die Bedingung immer wahr und die Passwortprüfung auskommentiert!',
        questions: [
          {
            id: 'q-sqli-3',
            prompt: 'Welches Zeichen dient in SQL-Syntax dazu, den Rest der Zeile auszukommentieren?',
            answerHint: 'Zwei Bindestriche gefolgt von einem Leerzeichen.',
            expectedAnswers: ['--', '-- -', '#', '/*'],
            points: 30,
          },
          {
            id: 'q-sqli-4',
            prompt: 'Gib die Admin-Flag ein, die nach erfolgreichem Login im VaultSec Dashboard angezeigt wird:',
            answerHint: 'Bypasse das Login im Target Web Viewer oder nutze den Payload \' OR 1=1 -- im Web-Simulator.',
            expectedAnswers: [
              'THM{unrestricted_sql_bypass_2026}',
              'thm{unrestricted_sql_bypass_2026}',
              'unrestricted_sql_bypass_2026',
            ],
            points: 100,
          },
        ],
      },
    ],
  },
  {
    id: 'room-privesc',
    title: 'Linux Privilege Escalation: SUID & Root Access',
    slug: 'linux-privilege-escalation',
    category: 'Privilege Escalation',
    difficulty: 'Medium',
    estimatedMinutes: 50,
    totalXp: 220,
    description:
      'Vom normalen Benutzer zum Root-Administrator. Untersuche misconfigured SUID-Binaries, Cronjobs und Kernel-Schwachstellen. Komplette Hands-On Labs ohne Abo-Limits.',
    image: '/src/assets/images/room_linux_privesc_1793101203041.jpg',
    tags: ['Linux', 'PrivEsc', 'SUID', 'GTFOBins', 'Root'],
    isVipOnlyInOriginalTHM: true,
    targetMachine: {
      ip: '10.10.220.14',
      hostname: 'tux-root.thm',
      os: 'Debian 11',
      status: 'offline',
      uptimeSeconds: 0,
      openPorts: [
        { port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 8.4p1 Debian', state: 'open' },
        { port: 8080, protocol: 'tcp', service: 'http-proxy', version: 'Werkzeug/2.0.2 Python/3.9.2', state: 'open' },
      ],
      webApp: {
        title: 'Tux Internal Server Management',
        type: 'lfi',
        path: '/diagnostics?file=system.log',
      },
    },
    tasks: [
      {
        id: 'task-priv-1',
        title: 'Task 1: SUID-Enumeration & GTFOBins',
        description:
          'Finde Binärdateien mit gesetztem SUID-Bit (`chmod u+s`), die mit den Rechten des Besitzers (oft root) ausgeführt werden.',
        theory:
          'Der Befehl `find / -perm -u=s -type f 2>/dev/null` listet alle SUID-Binaries auf dem System auf. Auf gtfobins.github.io finden Potester verifizierte Ausnutzungs-Payloads für gängige Linux-Programme.',
        questions: [
          {
            id: 'q-priv-1',
            prompt: 'Mit welchem Linux-Befehl überprüfst du deine aktuellen Gruppen und Berechtigungen?',
            answerHint: 'Zwei-Buchstaben Befehl oder whoami.',
            expectedAnswers: ['id', 'whoami', 'groups'],
            points: 20,
          },
          {
            id: 'q-priv-2',
            prompt: 'Welche Ziffer repräsentiert das SUID-Bit bei oktaler Rechtevergabe (z.B. chmod XXXX)?',
            answerHint: 'SUID = 4, SGID = 2, Sticky = 1.',
            expectedAnswers: ['4', '4000'],
            points: 40,
          },
        ],
      },
      {
        id: 'task-priv-2',
        title: 'Task 2: Capturing the Root Flag',
        description:
          'Nutze die LFI-Schwachstelle im Web-Interface der Maschine oder lies über die SUID-Binary die Root-Flag in `/root/root.txt` aus.',
        theory:
          'Local File Inclusion (LFI) erlaubt Angreifern, systeminterne Dateien wie `/etc/shadow` oder `/root/root.txt` einzusehen.',
        questions: [
          {
            id: 'q-priv-3',
            prompt: 'In welcher Systemdatei werden in modernen Linux-Systemen die gehashten Benutzerpasswörter gespeichert?',
            answerHint: 'Liegt im /etc Verzeichnis.',
            expectedAnswers: ['/etc/shadow', 'shadow', '/etc/shadow/'],
            points: 40,
          },
          {
            id: 'q-priv-4',
            prompt: 'Gib die Root-Flag ein (/root/root.txt):',
            answerHint: 'Nutze im LFI-Web-Simulator den Pfad ../../../../root/root.txt.',
            expectedAnswers: [
              'THM{suid_root_pwned_zero_limits}',
              'thm{suid_root_pwned_zero_limits}',
              'suid_root_pwned_zero_limits',
            ],
            points: 120,
          },
        ],
      },
    ],
  },
  {
    id: 'room-network',
    title: 'Network Reconnaissance: Nmap & Service Auditing',
    slug: 'network-reconnaissance-nmap',
    category: 'Network Security',
    difficulty: 'Easy',
    estimatedMinutes: 25,
    totalXp: 150,
    description:
      'Lerne professionelle Port- und Dienst-Erkennung. Meistere SYN-Scans, Service-Fingerprinting, NSE-Skripte und Banner-Grabbing auf realen Zielen.',
    image: '/src/assets/images/room_network_recon_1793101203412.jpg',
    tags: ['Nmap', 'Networking', 'Recon', 'TCP/IP', 'Scanning'],
    isVipOnlyInOriginalTHM: false,
    targetMachine: {
      ip: '10.10.89.55',
      hostname: 'recon-lab.thm',
      os: 'Linux Ubuntu 22.04 LTS',
      status: 'offline',
      uptimeSeconds: 0,
      openPorts: [
        { port: 21, protocol: 'tcp', service: 'ftp', version: 'vsftpd 3.0.3 (anonymous allowed)', state: 'open' },
        { port: 80, protocol: 'tcp', service: 'http', version: 'nginx 1.18.0', state: 'open' },
        { port: 445, protocol: 'tcp', service: 'microsoft-ds', version: 'Samba smbd 4.6.2', state: 'open' },
      ],
      webApp: {
        title: 'Recon Lab Network Diagnostics Hub',
        type: 'recon_portal',
        path: '/robots.txt',
      },
    },
    tasks: [
      {
        id: 'task-net-1',
        title: 'Task 1: TCP Handshake & Scan Typen',
        description:
          'Verstehe den Unterschied zwischen TCP Connect Scan (-sT) und dem stealthier SYN Scan (-sS).',
        theory:
          'Ein SYN-Scan schließt den Three-Way-Handshake nicht mit einem finalen ACK ab, sondern sendet ein RST. Dadurch hinterlässt er weniger Spuren in Anwendungslogs.',
        questions: [
          {
            id: 'q-net-1',
            prompt: 'Welche Nmap-Option aktiviert einen SYN Stealth Scan?',
            answerHint: '-sS',
            expectedAnswers: ['-sS', 'sS', '-sS scan'],
            points: 25,
          },
          {
            id: 'q-net-2',
            prompt: 'Welcher Dienst läuft auf Port 21 der Zielmaschine?',
            answerHint: 'Protokoll zur Dateiübertragung.',
            expectedAnswers: ['ftp', 'vsftpd', 'FTP'],
            points: 25,
          },
          {
            id: 'q-net-3',
            prompt: 'Finde die versteckte Flag in der robots.txt des Webservers:',
            answerHint: 'Führe im Terminal `curl 10.10.89.55/robots.txt` aus.',
            expectedAnswers: [
              'THM{robots_file_enumeration_success}',
              'thm{robots_file_enumeration_success}',
              'robots_file_enumeration_success',
            ],
            points: 100,
          },
        ],
      },
    ],
  },
  {
    id: 'room-cmdi',
    title: 'Command Injection & Remote Code Execution',
    slug: 'command-injection-rce',
    category: 'Web Exploitation',
    difficulty: 'Medium',
    estimatedMinutes: 40,
    totalXp: 200,
    description:
      'Wie Angreifer Betriebssystem-Befehle durch fehlerhafte Eingabevalidierung einschleusen. Nutze Bash-Delimiter wie `;`, `&&` und `|`, um eine interaktive Reverse-Shell zu erzeugen.',
    image: '/src/assets/images/hero_cyber_range_1793101202349.jpg',
    tags: ['RCE', 'Command Injection', 'Reverse Shell', 'Bash', 'Web Security'],
    isVipOnlyInOriginalTHM: true,
    targetMachine: {
      ip: '10.10.198.42',
      hostname: 'netping.thm',
      os: 'Alpine Linux',
      status: 'offline',
      uptimeSeconds: 0,
      openPorts: [
        { port: 80, protocol: 'tcp', service: 'http', version: 'Gunicorn/20.1.0 Python/3.10', state: 'open' },
      ],
      webApp: {
        title: 'NetPing Utility Diagnostic Tool',
        type: 'command_injection',
        path: '/ping',
      },
    },
    tasks: [
      {
        id: 'task-cmdi-1',
        title: 'Task 1: Identifying Command Injection',
        description:
          'Der Server bietet ein Web-Werkzeug zum Pingen von IP-Adressen. Teste, ob Befehlstrenner wie `;` oder `&&` ungefiltert an die Shell übergeben werden.',
        theory:
          'Wenn Entwickler `os.system("ping -c 1 " + ip)` verwenden, kann der Benutzer `127.0.0.1; whoami` eingeben. Die Shell führt dann beide Befehle nacheinander aus.',
        questions: [
          {
            id: 'q-cmdi-1',
            prompt: 'Welcher Operator in Bash führt den zweiten Befehl nur dann aus, wenn der erste erfolgreich war?',
            answerHint: 'Zwei kaufmännische Und-Zeichen.',
            expectedAnswers: ['&&', 'and', '&& operator'],
            points: 30,
          },
          {
            id: 'q-cmdi-2',
            prompt: 'Gib die Flag ein, indem du im NetPing Tool `127.0.0.1; cat flag.txt` ausführst:',
            answerHint: 'Nutze den Web-Simulator Tab für NetPing.',
            expectedAnswers: [
              'THM{rce_pipe_command_executed_freely}',
              'thm{rce_pipe_command_executed_freely}',
              'rce_pipe_command_executed_freely',
            ],
            points: 170,
          },
        ],
      },
    ],
  },
  {
    id: 'room-crypto',
    title: 'Cryptography: Ciphers, Hashes & Cracking',
    slug: 'cryptography-hashes-cracking',
    category: 'Cryptography',
    difficulty: 'Easy',
    estimatedMinutes: 30,
    totalXp: 160,
    description:
      'Verstehe den Unterschied zwischen symmetrischer/asymmetrischer Verschlüsselung, Encodings (Base64, Hex) und Einweg-Hashfunktionen (MD5, SHA-256). Nutze John the Ripper und CyberChef.',
    image: '/src/assets/images/room_web_security_1793101201512.jpg',
    tags: ['Crypto', 'Base64', 'Hashes', 'John The Ripper', 'CyberChef'],
    isVipOnlyInOriginalTHM: false,
    targetMachine: {
      ip: '10.10.50.12',
      hostname: 'crypto-vault.thm',
      os: 'Linux Ubuntu 22.04 LTS',
      status: 'offline',
      uptimeSeconds: 0,
      openPorts: [
        { port: 22, protocol: 'tcp', service: 'ssh', version: 'OpenSSH 8.9', state: 'open' },
      ],
    },
    tasks: [
      {
        id: 'task-crypto-1',
        title: 'Task 1: Encodings vs. Encryption',
        description:
          'Encoding ist KEINE Verschlüsselung, da kein geheimer Schlüssel benötigt wird. Dekodiere die Nachricht mit unserem integrierten Hacker Toolbelt.',
        theory:
          'Base64 kodiert Binärdaten in 64 druckbare ASCII-Zeichen. Ein typisches Erkennungsmerkmal sind `=` oder `==` am Ende als Padding.',
        questions: [
          {
            id: 'q-crypto-1',
            prompt: 'Dekodiere den Base64-String: "Um9vdEZvcmdlIHVuYm91bmQ="',
            answerHint: 'Nutze das Hacker-Toolbelt im Navigationsmenü unter "Hacker Toolbelt".',
            expectedAnswers: ['RootForge unbound', 'RootForge unbound'],
            points: 40,
          },
          {
            id: 'q-crypto-2',
            prompt: 'Welche Ausgabegröße in Bits erzeugt ein SHA-256 Hash?',
            answerHint: 'Steht bereits im Namen des Algorithmus.',
            expectedAnswers: ['256', '256 bits', '256 bit'],
            points: 30,
          },
          {
            id: 'q-crypto-3',
            prompt: 'Cracker-Challenge: Finde das Klartext-Passwort zum MD5-Hash "5f4dcc3b5aa765d61d8327deb882cf99":',
            answerHint: 'Ein extrem bekanntes englisches Standardwort.',
            expectedAnswers: ['password', 'Password'],
            points: 90,
          },
        ],
      },
    ],
  },
  {
    id: 'room-ad',
    title: 'Active Directory Fundamentals: Kerberos & LDAP',
    slug: 'active-directory-kerberos',
    category: 'Active Directory',
    difficulty: 'Hard',
    estimatedMinutes: 60,
    totalXp: 300,
    description:
      'Unternehmenssicherheit in Windows-Domänen. Verstehe Kerberos Tickets (TGT & TGS), Kerberoasting, BloodHound-Graphen und Domain Controller Angriffe.',
    image: '/src/assets/images/room_linux_privesc_1793101203041.jpg',
    tags: ['Active Directory', 'Windows', 'Kerberos', 'Kerberoasting', 'Red Team'],
    isVipOnlyInOriginalTHM: true,
    targetMachine: {
      ip: '10.10.170.200',
      hostname: 'CORP-DC01.local',
      os: 'Windows Server 2022',
      status: 'offline',
      uptimeSeconds: 0,
      openPorts: [
        { port: 53, protocol: 'tcp', service: 'domain', version: 'Microsoft DNS', state: 'open' },
        { port: 88, protocol: 'tcp', service: 'kerberos-sec', version: 'Microsoft Windows Kerberos', state: 'open' },
        { port: 389, protocol: 'tcp', service: 'ldap', version: 'Microsoft Windows Active Directory LDAP', state: 'open' },
        { port: 445, protocol: 'tcp', service: 'microsoft-ds', version: 'Windows Server 2022 SMB', state: 'open' },
      ],
    },
    tasks: [
      {
        id: 'task-ad-1',
        title: 'Task 1: Kerberos Authentication Flow',
        description:
          'Lerne die drei Parteien im Kerberos-Prozess: Client, Key Distribution Center (KDC) und Ziel-Service.',
        theory:
          'Der Client fordert vom Authentication Service (AS) ein Ticket Granting Ticket (TGT). Mit dem TGT fragt er beim Ticket Granting Service (TGS) nach einem Ticket für den Ziel-Service.',
        questions: [
          {
            id: 'q-ad-1',
            prompt: 'Auf welchem Standard-Port lauscht der Kerberos-Dienst (TCP/UDP)?',
            answerHint: 'Port 88',
            expectedAnswers: ['88', 'port 88'],
            points: 40,
          },
          {
            id: 'q-ad-2',
            prompt: 'Welche Abkürzung steht für das Ticket, das der Benutzer nach erfolgreichem Login vom KDC erhält?',
            answerHint: 'Ticket Granting Ticket',
            expectedAnswers: ['TGT', 'tgt'],
            points: 60,
          },
          {
            id: 'q-ad-3',
            prompt: 'Gib die Active Directory Domain Admin Flag ein:',
            answerHint: 'Format: THM{domain_admin_kerberoast_pwned}',
            expectedAnswers: [
              'THM{domain_admin_kerberoast_pwned}',
              'thm{domain_admin_kerberoast_pwned}',
              'domain_admin_kerberoast_pwned',
            ],
            points: 200,
          },
        ],
      },
    ],
  },
];

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-jr-pentester',
    title: 'Junior Penetration Tester',
    slug: 'junior-penetration-tester',
    description:
      'Der beliebteste Pfad auf TryHackMe – hier 100% ohne Abo und ohne Wartezeiten. Von Network Recon bis Web Exploitation und Linux PrivEsc.',
    difficulty: 'Medium',
    estimatedHours: 24,
    careerRole: 'Junior Penetration Tester / Ethical Hacker',
    modulesCount: 5,
    roomIds: ['room-network', 'room-sqli', 'room-cmdi', 'room-privesc', 'room-crypto'],
    bannerColor: 'from-emerald-950/60 to-slate-900',
  },
  {
    id: 'path-pre-security',
    title: 'Pre-Security Fundamentals',
    slug: 'pre-security-fundamentals',
    description:
      'Perfekt für Einsteiger. Lerne die essenziellen Grundlagen von Computernetzwerken, Webtechnologien und Linux-Befehlen.',
    difficulty: 'Easy',
    estimatedHours: 12,
    careerRole: 'Cybersecurity Analyst (Beginner)',
    modulesCount: 3,
    roomIds: ['room-network', 'room-crypto', 'room-sqli'],
    bannerColor: 'from-cyan-950/60 to-slate-900',
  },
  {
    id: 'path-web-specialist',
    title: 'Web Application Pentester',
    slug: 'web-application-pentester',
    description:
      'Tauche tief in die OWASP Top 10 ein: SQL Injection, Command Injection, LFI/RFI, Cross-Site Scripting und Authentication Flaws.',
    difficulty: 'Medium',
    estimatedHours: 18,
    careerRole: 'Application Security Engineer (AppSec)',
    modulesCount: 3,
    roomIds: ['room-sqli', 'room-cmdi', 'room-privesc'],
    bannerColor: 'from-amber-950/60 to-slate-900',
  },
  {
    id: 'path-enterprise-redteam',
    title: 'Enterprise Red Team & Active Directory',
    slug: 'enterprise-red-team',
    description:
      'Fortgeschrittene Techniken für Unternehmensnetzwerke: Active Directory, Kerberoasting, Lateral Movement und Domain Compromise.',
    difficulty: 'Hard',
    estimatedHours: 32,
    careerRole: 'Senior Red Team Operator / Pentester',
    modulesCount: 4,
    roomIds: ['room-ad', 'room-privesc', 'room-network', 'room-sqli'],
    bannerColor: 'from-rose-950/60 to-slate-900',
  },
];
