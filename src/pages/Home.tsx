import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { WorkBook } from 'xlsx';
import B3 from '../components/B3';
import B3Clue from '../components/B3Clue';
import Domuapp from '../components/Domuapp';
import ExportFile from '../components/ExportFile';
import { Comp } from '../core/types';

export type CustomFile = {
  wb: WorkBook;
  file: File;
};

const HomeComp = ({ className }: Comp) => {
  const [b3File, setB3File] = useState<CustomFile>();
  const [b3ClueIsOpen, setB3ClueIsOpen] = useState(false);
  const [domuappFile, setDomuappFile] = useState<CustomFile>();

  const onNewB3File = useCallback((wb: WorkBook, file: File) => {
    setB3File({ wb, file });
  }, []);

  const onNewDomuappFile = useCallback((wb: WorkBook, file: File) => {
    setDomuappFile({ wb, file });
  }, []);

  return (
    <div className={className}>
      <B3
        file={b3File?.file}
        fileLoaded={!!b3File?.wb}
        onNewFile={onNewB3File}
        clue={(e) => {
          e.stopPropagation();
          setB3ClueIsOpen(true);
        }}
      />
      <Domuapp
        file={domuappFile?.file}
        onNewFile={onNewDomuappFile}
        fileLoaded={!!domuappFile?.wb}
      />
      <ExportFile
        b3={b3File}
        domuapp={domuappFile}
        onClose={() => {
          setB3File(undefined);
          setDomuappFile(undefined);
        }}
      />
      <B3Clue isOpen={b3ClueIsOpen} onClose={() => setB3ClueIsOpen(false)} />
    </div>
  );
};

const Home = styled(HomeComp)`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`;

export default Home;
