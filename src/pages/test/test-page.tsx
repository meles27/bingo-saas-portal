import withAnimation from '@/components/base/route-animation/with-animation';
import { useSocket } from '@/hooks/base/use-socket';
import { SocketEvent } from '@/lib/socket/socket.schema';

import React, { useEffect, useState } from 'react';

interface LiveGameFeedProps {
  roundId: string;
}

export const LiveGameFeed: React.FC<LiveGameFeedProps> = ({ roundId }) => {
  const [calledNumbers, setCalledNumbers] = useState<Record<string, any>[]>([]);
  const [roundStatus, setRoundStatus] = useState<string>('waiting');

  // --- Real-time Logic ---

  // Listen for new bingo calls on the PUBLIC channel
  useSocket<object>('public', SocketEvent.NEW_BINGO_CALL, (response) => {
    if (response.status === 'success') {
      console.log('New number called:', response.payload);
      // Add the new number to the start of our list
      setCalledNumbers((prevNumbers) => [response.payload, ...prevNumbers]);
    }
  });

  // Listen for round status updates on the PUBLIC channel
  useSocket<Record<string, string>>(
    'public',
    SocketEvent.ROUND_STATUS_UPDATE,
    (response) => {
      if (response.status === 'info') {
        console.log('Round status changed:', response.payload.status);
        setRoundStatus(response.payload.status);
      }
    }
  );

  // Effect to fetch initial game state (e.g., via a standard API call)
  useEffect(() => {
    //
    // api.getRoundDetails(roundId).then(data => {
    //   setCalledNumbers(data.calls);
    //   setRoundStatus(data.status);
    // });
    //
  }, [roundId]);

  return (
    <div>
      <h2>Live Feed for Round {roundId}</h2>
      <h3>Status: {roundStatus.toUpperCase()}</h3>

      <h4>Called Numbers (Latest First):</h4>
      <ul>
        {calledNumbers.map((call) => (
          <li key={call.id}>
            #{call.sequence}: <strong>{call.number}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const TestPage = withAnimation(() => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <h1 className="text-3xl font-bold">Test Page</h1>
      <LiveGameFeed roundId="1" />
    </div>
  );
});
