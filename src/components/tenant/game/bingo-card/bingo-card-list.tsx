import { ApiError } from '@/components/base/api-error';
import {
  CustomPagination,
  type CustomPaginationRefIFace
} from '@/components/base/custom-pagination';
import { EmptyList } from '@/components/base/empty-list';
import withAnimation from '@/components/base/route-animation/with-animation';
import { SearchInput } from '@/components/base/search-input';
import { Spinner } from '@/components/base/spinner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { urls } from '@/config/urls'; // Assume urls.getBingoCardsUrl() exists
import { useQuery } from '@/hooks/base/api/useQuery';
import { useConfigStore } from '@/store/config-store';
import type { PaginatedResponse } from '@/types/api/base';
import type {
  BingoCardQueryParamsIface,
  ListBingoCardEntity
} from '@/types/api/game/bingo-card';
import { PlusCircle } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { BingoCard } from './bingo-card';

export const BingoCardList = withAnimation(() => {
  const PAGE_SIZE = useConfigStore((state) => state.PAGE_SIZE);
  const [searchParams, setSearchParams] = useState<BingoCardQueryParamsIface>({
    offset: 0,
    limit: PAGE_SIZE
  });

  const paginationRef = useRef<CustomPaginationRefIFace | null>(null);

  // Use the useQuery hook to fetch paginated card data
  const cardsQuery = useQuery<PaginatedResponse<ListBingoCardEntity>>(
    urls.getCardTemplatesUrl(),
    {
      params: searchParams
    }
  );

  const cards = useMemo(
    () => cardsQuery.data?.results || [],
    [cardsQuery.data?.results]
  );

  const handleSearchChange = (search: string | undefined) => {
    paginationRef.current?.reset();
    setSearchParams((prev) => ({
      ...prev,
      offset: 0,
      search
    }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({
      ...prev,
      offset: page * PAGE_SIZE
    }));
  };

  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Bingo Cards</CardTitle>
            <CardDescription>
              Browse and manage generated bingo cards.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Generate New Cards
          </Button>
        </div>
      </CardHeader>

      <CardHeader>
        <SearchInput
          placeholder="Search by name or serial number..."
          onDebouncedChange={handleSearchChange}
          className="w-full md:max-w-sm"
        />
      </CardHeader>

      <CardContent>
        {cardsQuery.isLoading && <Spinner variant="page" />}
        {cardsQuery.isError && (
          <ApiError
            error={cardsQuery.error}
            customAction={{
              label: 'Retry',
              handler: cardsQuery.refetch
            }}
          />
        )}
        {cardsQuery.isSuccess && (
          <>
            {cards.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {cards.map((card) => (
                  <BingoCard key={card.id} card={card} />
                ))}
              </div>
            ) : (
              <EmptyList itemName="cards" />
            )}
          </>
        )}
      </CardContent>

      <CardFooter>
        <CustomPagination
          ref={paginationRef}
          totalItems={cardsQuery.data?.count || 0}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      </CardFooter>
    </Card>
  );
});
