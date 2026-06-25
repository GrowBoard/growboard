import { NavLink } from 'react-router-dom';
import { ProjectCardProps } from './types';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Image,
  Skeleton,
  Progress,
  Badge,
  Button,
  Flex,
  Text,
  Link,
} from '@chakra-ui/react';

/**
 * Project card component.
 * @param propsData The project card props.
 * @returns The project card component.
 */
const ProjectCard = ({ data }: ProjectCardProps) => {
  const { t } = useTranslation();
  const {
    image,
    title,
    description,
    icon,
    isLive,
    projectLiveLink,
    githubLink,
    completed,
    path,
  } = data;
  return (
    <Card.Root
      maxW="360px"
      overflow="hidden"
      variant="elevated"
      border="1px solid"
      borderColor="border.subtle"
      bg="bg.card"
      shadow="xl"
    >
      {image ? (
        <Image
          src={image}
          alt={title}
          loading="lazy"
          h="200px"
          w="100%"
          objectFit="cover"
        />
      ) : (
        <Skeleton h="200px" mx={2} mt={2} borderRadius="md" />
      )}
      <Card.Body gap={3} p={5}>
        <Flex
          direction="row"
          justify="space-between"
          align="center"
          p={2}
          borderRadius="xl"
          border="1px solid"
          borderColor="border.subtle"
          bg="bg.panel"
          w="100%"
        >
          <TitleAndLiveBadge
            title={title}
            isLive={isLive}
            liveLink={projectLiveLink}
          />
          {icon ? (
            <Image src={icon} alt={title} boxSize="40px" />
          ) : (
            <Skeleton boxSize="40px" borderRadius="full" />
          )}
        </Flex>
        <Text color="text.secondary" fontSize="sm" mt={2}>
          {description}
        </Text>
        <Flex align="center" justify="space-between" mt={2} gap={4} w="100%">
          <Progress.Root value={completed} flex="1" size="sm">
            <Progress.Track bg="bg.panel">
              <Progress.Range bg="blue.500" />
            </Progress.Track>
          </Progress.Root>
          <Text fontSize="md" fontWeight="semibold" color="blue.300">
            {completed}%
          </Text>
        </Flex>
        <Flex justify="space-between" mt={4} gap={3} w="100%">
          <Link
            href={githubLink}
            target="_blank"
            rel="noreferrer"
            style={{ flex: 1, textDecoration: 'none' }}
          >
            <Button
              variant="outline"
              borderColor="border.subtle"
              color="text.primary"
              _hover={{ bg: 'bg.active' }}
              w="100%"
            >
              {t('ProjectCard.projectLink')}
            </Button>
          </Link>
          <NavLink to={path} style={{ flex: 1, textDecoration: 'none' }}>
            <Button
              variant="solid"
              bg="blue.600"
              color="white"
              _hover={{ bg: 'blue.500' }}
              w="100%"
            >
              {t('ProjectCard.projectDetailsLink')}
            </Button>
          </NavLink>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};

// Title and live badge internal component.
function TitleAndLiveBadge(props: {
  title: string;
  isLive: boolean;
  liveLink: string;
}) {
  const { t } = useTranslation();
  return (
    <Flex align="center" gap={2}>
      <Card.Title>
        <Link
          href={`http://${props.liveLink}`}
          target="_blank"
          rel="noreferrer"
          color="white"
          fontWeight="bold"
          _hover={{ color: 'blue.300' }}
        >
          {props.title}
        </Link>
      </Card.Title>
      {props.isLive && (
        <Badge colorPalette="green" variant="solid" size="sm">
          {t('ProjectCard.liveStatus')}
        </Badge>
      )}
    </Flex>
  );
}

export default ProjectCard;
