// Comprehensive set of 16 Core LeetCode-style DSA Problems with full multi-language solutions & Judge0 testcases

const PROBLEMS_DATA = [
  {
    problemNumber: 1,
    title: "Two Sum",
    slug: "two-sum",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

### Example 1:
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

### Example 2:
\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

### Constraints:
* \`2 <= nums.length <= 10^4\`
* \`-10^9 <= nums[i] <= 10^9\`
* \`-10^9 <= target <= 10^9\`
* **Only one valid answer exists.**`,
    difficulty: "easy",
    topic: "arrays",
    subtopic: "prefix sum",
    concepts: ["Array", "Hash Table", "Complement Math"],
    tags: ["Array", "Hash Table"],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    examples: [
      {
        input: "4\n2 7 11 15\n9",
        output: "0 1",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9, indices are 0 and 1."
      },
      {
        input: "3\n3 2 4\n6",
        output: "1 2",
        explanation: "nums[1] + nums[2] = 2 + 4 = 6, indices are 1 and 2."
      }
    ],
    visibleTestCases: [
      {
        input: "4\n2 7 11 15\n9",
        output: "0 1",
        explanation: "2 + 7 = 9"
      },
      {
        input: "3\n3 2 4\n6",
        output: "1 2",
        explanation: "2 + 4 = 6"
      },
      {
        input: "2\n3 3\n6",
        output: "0 1",
        explanation: "3 + 3 = 6"
      }
    ],
    hiddenTestCases: [
      {
        input: "5\n1 5 8 12 14\n17",
        output: "1 3"
      },
      {
        input: "4\n-1 -2 -3 -4\n-6",
        output: "1 3"
      },
      {
        input: "6\n10 20 30 40 50 60\n90",
        output: "3 4"
      }
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;

    unordered_map<int, int> mp;
    for (int i = 0; i < n; i++) {
        int complement = target - nums[i];
        if (mp.count(complement)) {
            cout << mp[complement] << " " << i << "\\n";
            return 0;
        }
        mp[nums[i]] = i;
    }
    return 0;
}`
      },
      {
        language: "python",
        initialCode: `import sys

def solve():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    nums = [int(x) for x in data[1:n+1]]
    target = int(data[n+1])
    
    seen = {}
    for i, num in enumerate(nums):
        comp = target - num
        if comp in seen:
            print(f"{seen[comp]} {i}")
            return
        seen[num] = i

if __name__ == '__main__':
    solve()`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 1) {
    const n = parseInt(input[0]);
    const nums = input.slice(1, n + 1).map(Number);
    const target = parseInt(input[n + 1]);
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) {
            console.log(\`\${map.get(comp)} \${i}\`);
            return;
        }
        map.set(nums[i], i);
    }
}`
      },
      {
        language: "java",
        initialCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();

        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                System.out.println(map.get(comp) + " " + i);
                return;
            }
            map.put(nums[i], i);
        }
    }
}`
      }
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target; cin >> target;
    unordered_map<int, int> mp;
    for (int i = 0; i < n; i++) {
        int comp = target - nums[i];
        if (mp.count(comp)) { cout << mp[comp] << " " << i << endl; return 0; }
        mp[nums[i]] = i;
    }
    return 0;
}`
      }
    ],
    hints: [
      "Use a hash map to look up if the complement (target - nums[i]) has been seen previously in O(1) time."
    ],
    editorial: {
      approach: "Using a Hash Map gives O(n) single-pass runtime.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)"
    },
    acceptance: { submissionsCount: 1540, acceptedCount: 780, rate: 50.6 }
  },

  {
    problemNumber: 2,
    title: "Maximum Subarray (Kadane's Algorithm)",
    slug: "maximum-subarray",
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.

### Example 1:
\`\`\`
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.
\`\`\`

### Example 2:
\`\`\`
Input: nums = [1]
Output: 1
\`\`\`

### Constraints:
* \`1 <= nums.length <= 10^5\`
* \`-10^4 <= nums[i] <= 10^4\``,
    difficulty: "medium",
    topic: "arrays",
    subtopic: "Kadane",
    concepts: ["Array", "Dynamic Programming", "Divide and Conquer", "Kadane"],
    tags: ["Array", "Dynamic Programming"],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    examples: [
      {
        input: "9\n-2 1 -3 4 -1 2 1 -5 4",
        output: "6",
        explanation: "Subarray [4, -1, 2, 1] sums to 6."
      }
    ],
    visibleTestCases: [
      {
        input: "9\n-2 1 -3 4 -1 2 1 -5 4",
        output: "6",
        explanation: "[4, -1, 2, 1] has max sum 6"
      },
      {
        input: "5\n5 4 -1 7 8",
        output: "23",
        explanation: "Sum of whole array is 23"
      }
    ],
    hiddenTestCases: [
      {
        input: "4\n-3 -2 -1 -4",
        output: "-1"
      },
      {
        input: "3\n-10 20 -5",
        output: "20"
      }
    ],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    long long current_sum = nums[0];
    long long max_sum = nums[0];
    for (int i = 1; i < n; i++) {
        current_sum = max((long long)nums[i], current_sum + nums[i]);
        max_sum = max(max_sum, current_sum);
    }
    cout << max_sum << "\\n";
    return 0;
}`
      },
      {
        language: "python",
        initialCode: `import sys
def solve():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    nums = [int(x) for x in data[1:n+1]]
    cur = max_s = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        max_s = max(max_s, cur)
    print(max_s)
if __name__ == '__main__': solve()`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 1) {
    const n = parseInt(input[0]);
    const nums = input.slice(1, n + 1).map(Number);
    let cur = nums[0], max = nums[0];
    for (let i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);
        max = Math.max(max, cur);
    }
    console.log(max);
}`
      },
      {
        language: "java",
        initialCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        long cur = nums[0], max = nums[0];
        for (int i = 1; i < n; i++) {
            cur = Math.max(nums[i], cur + nums[i]);
            max = Math.max(max, cur);
        }
        System.out.println(max);
    }
}`
      }
    ],
    referenceSolution: [
      {
        language: "c++",
        completeCode: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int cur = nums[0], ans = nums[0];
    for (int i = 1; i < n; i++) { cur = max(nums[i], cur + nums[i]); ans = max(ans, cur); }
    cout << ans << endl;
    return 0;
}`
      }
    ],
    hints: ["Kadane's algorithm maintains `current = max(nums[i], current + nums[i])`."],
    editorial: { approach: "Kadane's algorithm computes max subarray in O(n).", timeComplexity: "O(n)", spaceComplexity: "O(1)" },
    acceptance: { submissionsCount: 2200, acceptedCount: 1100, rate: 50.0 }
  },

  {
    problemNumber: 3,
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    description: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.

### Example 1:
\`\`\`
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
\`\`\`

### Constraints:
* \`0 <= s.length <= 5 * 10^4\`
* \`s\` consists of English letters, digits, symbols and spaces.`,
    difficulty: "medium",
    topic: "sliding-window",
    subtopic: "variable window",
    concepts: ["Sliding Window", "Hash Map", "String"],
    tags: ["Hash Table", "String", "Sliding Window"],
    constraints: ["0 <= s.length <= 5 * 10^4"],
    examples: [{ input: "abcabcbb", output: "3", explanation: "'abc' is longest" }],
    visibleTestCases: [
      { input: "abcabcbb", output: "3", explanation: "Length is 3" },
      { input: "bbbbb", output: "1", explanation: "Length is 1" }
    ],
    hiddenTestCases: [{ input: "pwwkew", output: "3" }, { input: "dvdf", output: "3" }],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    if (!getline(cin, s)) { cout << 0 << "\\n"; return 0; }
    vector<int> last(256, -1);
    int ans = 0, l = 0;
    for (int r = 0; r < s.length(); r++) {
        unsigned char c = s[r];
        if (last[c] >= l) l = last[c] + 1;
        last[c] = r;
        ans = max(ans, r - l + 1);
    }
    cout << ans << "\\n";
    return 0;
}`
      },
      {
        language: "python",
        initialCode: `import sys
def solve():
    s = sys.stdin.readline().rstrip('\\n')
    last = {}
    ans = l = 0
    for r, c in enumerate(s):
        if c in last and last[c] >= l:
            l = last[c] + 1
        last[c] = r
        ans = max(ans, r - l + 1)
    print(ans)
if __name__ == '__main__': solve()`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf-8').replace(/\\r?\\n$/, '');
const map = new Map();
let ans = 0, l = 0;
for (let r = 0; r < s.length; r++) {
    const c = s[r];
    if (map.has(c) && map.get(c) >= l) l = map.get(c) + 1;
    map.set(c, r);
    ans = Math.max(ans, r - l + 1);
}
console.log(ans);`
      },
      {
        language: "java",
        initialCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        int[] last = new int[256];
        Arrays.fill(last, -1);
        int ans = 0, l = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (last[c] >= l) l = last[c] + 1;
            last[c] = r;
            ans = Math.max(ans, r - l + 1);
        }
        System.out.println(ans);
    }
}`
      }
    ],
    referenceSolution: [{ language: "c++", completeCode: `#include <bits/stdc++.h>\nusing namespace std;\nint main(){ string s; getline(cin,s); vector<int> l(256,-1); int a=0,p=0; for(int i=0;i<s.size();i++){ if(l[(unsigned char)s[i]]>=p) p=l[(unsigned char)s[i]]+1; l[(unsigned char)s[i]]=i; a=max(a,i-p+1); } cout<<a<<endl; return 0; }` }],
    hints: ["Jump left boundary to lastSeen[c] + 1."],
    editorial: { approach: "Variable window O(n).", timeComplexity: "O(n)", spaceComplexity: "O(1)" },
    acceptance: { submissionsCount: 3100, acceptedCount: 1420, rate: 45.8 }
  },

  {
    problemNumber: 4,
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.`,
    difficulty: "easy",
    topic: "stack",
    subtopic: "parentheses",
    concepts: ["Stack", "String", "LIFO"],
    tags: ["Stack", "String"],
    constraints: ["1 <= s.length <= 10^4"],
    examples: [{ input: "()[]{}", output: "true", explanation: "Valid bracket sequence" }],
    visibleTestCases: [
      { input: "()[]{}", output: "true", explanation: "Valid" },
      { input: "(]", output: "false", explanation: "Mismatch" }
    ],
    hiddenTestCases: [{ input: "{[]}", output: "true" }, { input: "([)]", output: "false" }],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <bits/stdc++.h>
using namespace std;
int main() {
    string s; if (!(cin >> s)) return 0;
    stack<char> st;
    for (char c : s) {
        if (c == '(') st.push(')');
        else if (c == '{') st.push('}');
        else if (c == '[') st.push(']');
        else {
            if (st.empty() || st.top() != c) { cout << "false\\n"; return 0; }
            st.pop();
        }
    }
    cout << (st.empty() ? "true" : "false") << "\\n";
    return 0;
}`
      },
      {
        language: "python",
        initialCode: `import sys
def solve():
    s = sys.stdin.read().strip()
    if not s: print("true"); return
    m = {')': '(', '}': '{', ']': '['}
    st = []
    for c in s:
        if c in m:
            top = st.pop() if st else '#'
            if m[c] != top: print("false"); return
        else: st.append(c)
    print("true" if not st else "false")
if __name__ == '__main__': solve()`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');
const s = fs.readFileSync(0, 'utf-8').trim();
const map = { ')': '(', '}': '{', ']': '[' };
const stack = [];
let valid = true;
for (const c of s) {
    if (map[c]) {
        const top = stack.pop() || '#';
        if (map[c] !== top) { valid = false; break; }
    } else { stack.push(c); }
}
if (stack.length > 0) valid = false;
console.log(valid ? "true" : "false");`
      },
      {
        language: "java",
        initialCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s = sc.next();
        Deque<Character> st = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') st.push(')');
            else if (c == '{') st.push('}');
            else if (c == '[') st.push(']');
            else {
                if (st.isEmpty() || st.pop() != c) { System.out.println("false"); return; }
            }
        }
        System.out.println(st.isEmpty() ? "true" : "false");
    }
}`
      }
    ],
    referenceSolution: [{ language: "c++", completeCode: `#include <bits/stdc++.h>\nusing namespace std;\nint main(){ string s; cin>>s; stack<char> st; for(char c:s){ if(c=='('||c=='{'||c=='[') st.push(c); else { if(st.empty()){cout<<"false\\n";return 0;} char t=st.top(); st.pop(); if((c==')'&&t!='(')||(c=='}'&&t!='{')||(c==']'&&t!='[')){cout<<"false\\n";return 0;} } } cout<<(st.empty()?"true":"false")<<endl; return 0; }` }],
    hints: ["Use LIFO stack."],
    editorial: { approach: "Stack LIFO matching.", timeComplexity: "O(n)", spaceComplexity: "O(n)" },
    acceptance: { submissionsCount: 4500, acceptedCount: 2250, rate: 50.0 }
  },

  {
    problemNumber: 5,
    title: "Binary Search",
    slug: "binary-search",
    description: `Given a sorted array of integers \`nums\` and an integer \`target\`, search \`target\` in \`nums\` in \`O(log n)\` time. Return the index if found, else \`-1\`.`,
    difficulty: "easy",
    topic: "binary-search",
    subtopic: "basic search",
    concepts: ["Binary Search", "Divide and Conquer", "O(log n)"],
    tags: ["Array", "Binary Search"],
    constraints: ["1 <= nums.length <= 10^4"],
    examples: [{ input: "6\n-1 0 3 5 9 12\n9", output: "4", explanation: "Found at index 4" }],
    visibleTestCases: [
      { input: "6\n-1 0 3 5 9 12\n9", output: "4", explanation: "Index 4" },
      { input: "6\n-1 0 3 5 9 12\n2", output: "-1", explanation: "Not found" }
    ],
    hiddenTestCases: [{ input: "1\n5\n5", output: "0" }, { input: "2\n1 3\n3", output: "1" }],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target; cin >> target;
    int l = 0, r = n - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (nums[m] == target) { cout << m << "\\n"; return 0; }
        if (nums[m] < target) l = m + 1;
        else r = m - 1;
    }
    cout << -1 << "\\n";
    return 0;
}`
      },
      {
        language: "python",
        initialCode: `import sys
def solve():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    nums = [int(x) for x in data[1:n+1]]
    target = int(data[n+1])
    l, r = 0, n - 1
    while l <= r:
        m = (l + r) // 2
        if nums[m] == target: print(m); return
        if nums[m] < target: l = m + 1
        else: r = m - 1
    print(-1)
if __name__ == '__main__': solve()`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 1) {
    const n = parseInt(input[0]);
    const nums = input.slice(1, n + 1).map(Number);
    const target = parseInt(input[n + 1]);
    let l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        const m = Math.floor((l + r) / 2);
        if (nums[m] === target) { ans = m; break; }
        if (nums[m] < target) l = m + 1;
        else r = m - 1;
    }
    console.log(ans);
}`
      },
      {
        language: "java",
        initialCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();
        int l = 0, r = n - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (nums[m] == target) { System.out.println(m); return; }
            if (nums[m] < target) l = m + 1;
            else r = m - 1;
        }
        System.out.println(-1);
    }
}`
      }
    ],
    referenceSolution: [{ language: "c++", completeCode: `#include <bits/stdc++.h>\nusing namespace std;\nint main(){ int n; cin>>n; vector<int> nums(n); for(int i=0;i<n;i++) cin>>nums[i]; int t; cin>>t; int l=0,r=n-1; while(l<=r){ int m=l+(r-l)/2; if(nums[m]==t){cout<<m<<endl; return 0;} if(nums[m]<t) l=m+1; else r=m-1; } cout<<-1<<endl; return 0; }` }],
    hints: ["Repeatedly halve the search space."],
    editorial: { approach: "Binary Search in O(log n).", timeComplexity: "O(log n)", spaceComplexity: "O(1)" },
    acceptance: { submissionsCount: 3800, acceptedCount: 2090, rate: 55.0 }
  },

  {
    problemNumber: 6,
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top. Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    difficulty: "easy",
    topic: "dp",
    subtopic: "1D DP",
    concepts: ["Dynamic Programming", "Memoization", "Fibonacci"],
    tags: ["Math", "Dynamic Programming", "Memoization"],
    constraints: ["1 <= n <= 45"],
    examples: [{ input: "2", output: "2", explanation: "2 ways" }],
    visibleTestCases: [
      { input: "2", output: "2", explanation: "2 ways" },
      { input: "3", output: "3", explanation: "3 ways" }
    ],
    hiddenTestCases: [{ input: "5", output: "8" }, { input: "10", output: "89" }],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; if (!(cin >> n)) return 0;
    if (n <= 2) { cout << n << "\\n"; return 0; }
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) { int c = a + b; a = b; b = c; }
    cout << b << "\\n";
    return 0;
}`
      },
      {
        language: "python",
        initialCode: `import sys
def solve():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    if n <= 2: print(n); return
    a, b = 1, 2
    for _ in range(3, n + 1): a, b = b, a + b
    print(b)
if __name__ == '__main__': solve()`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');
const n = parseInt(fs.readFileSync(0, 'utf-8').trim(), 10);
if (n <= 2) { console.log(n); return; }
let a = 1, b = 2;
for (let i = 3; i <= n; i++) { const c = a + b; a = b; b = c; }
console.log(b);`
      },
      {
        language: "java",
        initialCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        if (n <= 2) { System.out.println(n); return; }
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) { int c = a + b; a = b; b = c; }
        System.out.println(b);
    }
}`
      }
    ],
    referenceSolution: [{ language: "c++", completeCode: `#include <iostream>\nusing namespace std;\nint main(){ int n; cin>>n; if(n<=2){cout<<n<<endl;return 0;} int a=1,b=2; for(int i=3;i<=n;i++){int c=a+b;a=b;b=c;} cout<<b<<endl; return 0; }` }],
    hints: ["Fibonacci recurrence f(n) = f(n-1) + f(n-2)."],
    editorial: { approach: "Fibonacci in O(n) time O(1) space.", timeComplexity: "O(n)", spaceComplexity: "O(1)" },
    acceptance: { submissionsCount: 4100, acceptedCount: 2200, rate: 53.6 }
  },

  {
    problemNumber: 7,
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve. If you cannot achieve any profit, return \`0\`.`,
    difficulty: "easy",
    topic: "arrays",
    subtopic: "traversal",
    concepts: ["Array", "Dynamic Programming", "Greedy"],
    tags: ["Array", "Dynamic Programming"],
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    examples: [{ input: "6\n7 1 5 3 6 4", output: "5", explanation: "Buy day 2 (price 1), sell day 5 (price 6), profit = 5" }],
    visibleTestCases: [
      { input: "6\n7 1 5 3 6 4", output: "5", explanation: "Buy at 1, sell at 6 = profit 5" },
      { input: "5\n7 6 4 3 1", output: "0", explanation: "No profit possible" }
    ],
    hiddenTestCases: [{ input: "3\n2 4 1", output: "2" }, { input: "4\n1 2 3 4", output: "3" }],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; if (!(cin >> n)) return 0;
    vector<int> prices(n);
    for (int i = 0; i < n; i++) cin >> prices[i];
    int minPrice = prices[0], maxProfit = 0;
    for (int i = 1; i < n; i++) {
        maxProfit = max(maxProfit, prices[i] - minPrice);
        minPrice = min(minPrice, prices[i]);
    }
    cout << maxProfit << "\\n";
    return 0;
}`
      },
      {
        language: "python",
        initialCode: `import sys
def solve():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    prices = [int(x) for x in data[1:n+1]]
    min_p, max_profit = prices[0], 0
    for p in prices[1:]:
        max_profit = max(max_profit, p - min_p)
        min_p = min(min_p, p)
    print(max_profit)
if __name__ == '__main__': solve()`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 1) {
    const n = parseInt(input[0]);
    const prices = input.slice(1, n + 1).map(Number);
    let minP = prices[0], maxProf = 0;
    for (let i = 1; i < prices.length; i++) {
        maxProf = Math.max(maxProf, prices[i] - minP);
        minP = Math.min(minP, prices[i]);
    }
    console.log(maxProf);
}`
      },
      {
        language: "java",
        initialCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) prices[i] = sc.nextInt();
        int minPrice = prices[0], maxProfit = 0;
        for (int i = 1; i < n; i++) {
            maxProfit = Math.max(maxProfit, prices[i] - minPrice);
            minPrice = Math.min(minPrice, prices[i]);
        }
        System.out.println(maxProfit);
    }
}`
      }
    ],
    referenceSolution: [{ language: "c++", completeCode: `#include <bits/stdc++.h>\nusing namespace std;\nint main(){ int n; cin>>n; vector<int> p(n); for(int i=0;i<n;i++) cin>>p[i]; int mp=p[0], ans=0; for(int i=1;i<n;i++){ ans=max(ans, p[i]-mp); mp=min(mp, p[i]); } cout<<ans<<endl; return 0; }` }],
    hints: ["Track running minimum price and compare with current day price."],
    editorial: { approach: "Track minimum price seen so far in single pass.", timeComplexity: "O(n)", spaceComplexity: "O(1)" },
    acceptance: { submissionsCount: 5200, acceptedCount: 2860, rate: 55.0 }
  },

  {
    problemNumber: 8,
    title: "Contains Duplicate",
    slug: "contains-duplicate",
    description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
    difficulty: "easy",
    topic: "hashing",
    subtopic: "duplicates",
    concepts: ["Hash Table", "Set", "Sorting"],
    tags: ["Array", "Hash Table", "Sorting"],
    constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    examples: [{ input: "4\n1 2 3 1", output: "true", explanation: "1 appears twice" }],
    visibleTestCases: [
      { input: "4\n1 2 3 1", output: "true", explanation: "Has duplicate" },
      { input: "4\n1 2 3 4", output: "false", explanation: "All distinct" }
    ],
    hiddenTestCases: [{ input: "1\n10", output: "false" }, { input: "6\n1 1 1 3 3 4", output: "true" }],
    startCode: [
      {
        language: "c++",
        initialCode: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; if (!(cin >> n)) return 0;
    unordered_set<int> seen;
    for (int i = 0; i < n; i++) {
        int x; cin >> x;
        if (seen.count(x)) { cout << "true\\n"; return 0; }
        seen.insert(x);
    }
    cout << "false\\n";
    return 0;
}`
      },
      {
        language: "python",
        initialCode: `import sys
def solve():
    data = sys.stdin.read().split()
    if not data: return
    n = int(data[0])
    nums = [int(x) for x in data[1:n+1]]
    seen = set()
    for x in nums:
        if x in seen: print("true"); return
        seen.add(x)
    print("false")
if __name__ == '__main__': solve()`
      },
      {
        language: "javascript",
        initialCode: `const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
if (input.length > 1) {
    const n = parseInt(input[0]);
    const nums = input.slice(1, n + 1).map(Number);
    const seen = new Set();
    let dup = false;
    for (const x of nums) {
        if (seen.has(x)) { dup = true; break; }
        seen.add(x);
    }
    console.log(dup ? "true" : "false");
}`
      },
      {
        language: "java",
        initialCode: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        Set<Integer> seen = new HashSet<>();
        for (int i = 0; i < n; i++) {
            int x = sc.nextInt();
            if (seen.contains(x)) { System.out.println("true"); return; }
            seen.add(x);
        }
        System.out.println("false");
    }
}`
      }
    ],
    referenceSolution: [{ language: "c++", completeCode: `#include <bits/stdc++.h>\nusing namespace std;\nint main(){ int n; cin>>n; unordered_set<int> s; for(int i=0;i<n;i++){ int x; cin>>x; if(s.count(x)){cout<<"true\\n";return 0;} s.insert(x); } cout<<"false\\n"; return 0; }` }],
    hints: ["Use a HashSet to store seen elements in O(1)."],
    editorial: { approach: "HashSet lookup in O(n) time.", timeComplexity: "O(n)", spaceComplexity: "O(n)" },
    acceptance: { submissionsCount: 4800, acceptedCount: 2900, rate: 60.4 }
  }
];

module.exports = PROBLEMS_DATA;
